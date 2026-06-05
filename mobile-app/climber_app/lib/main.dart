import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:permission_handler/permission_handler.dart' as perm;

void main() {
  runApp(const ClimberApp());
}

const double kMapMinRadiusM = 250.0;
const double kPathMinMoveM = 15.0;

// Fast timeout fixes.
const int kEspDisconnectedAfterSec = 6;
const int kArmbandLostAfterSec = 6;
const int kStatusRefreshSec = 1;
const int kGpsPostSec = 10;
const int kBleScanEverySec = 3;
const int kBleScanDurationSec = 1;

class ClimberApp extends StatelessWidget {
  const ClimberApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Climber Safety',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.red,
        scaffoldBackgroundColor: const Color(0xFFF3F4F6),
      ),
      home: const HomePage(),
    );
  }
}

class DeviceStatus {
  String id = 'CLIMBER01';

  double lat = 0;
  double lon = 0;
  double altitude = 0;

  double baseLat = 0;
  double baseLon = 0;

  double lastKnownLat = 0;
  double lastKnownLon = 0;
  int lastKnownAgeMs = 0;
  int gpsAgeMs = 0;
  int gpsSatellites = 0;
  double gpsHdop = 99.9;
  String gpsRejectReason = 'waiting';

  bool gpsCurrentFix = false;
  bool hasLastKnownLocation = false;

  double distanceToBaseM = 0;
  double bearingFromBaseDeg = 0;
  double movementBearingDeg = 0;

  String directionFromBase = 'N';
  String movementDirection = 'N';
  String gpsSource = 'NO_GPS';

  int bpm = 0;
  int battery = 0;
  int armbandBattery = 0;
  int sos = 0;
  int rssi = 0;
  double snr = 0;

  bool wifiReady = false;
  bool loraReady = false;
  bool armbandConnected = false;
  bool sensorAttached = false;

  int baseMsgSeq = 0;
  String lastBaseMessage = 'No message yet';
  String lastSentMessage = 'No message sent';

  DeviceStatus();

  DeviceStatus.fromJson(Map<String, dynamic> j) {
    id = j['id'] ?? 'CLIMBER01';

    lat = (j['lat'] ?? 0).toDouble();
    lon = (j['lon'] ?? 0).toDouble();
    altitude = (j['altitude'] ?? 0).toDouble();

    baseLat = (j['baseLat'] ?? 0).toDouble();
    baseLon = (j['baseLon'] ?? 0).toDouble();

    lastKnownLat = (j['lastKnownLat'] ?? 0).toDouble();
    lastKnownLon = (j['lastKnownLon'] ?? 0).toDouble();
    lastKnownAgeMs = j['lastKnownAgeMs'] ?? 0;
    gpsAgeMs = j['gpsAgeMs'] ?? 0;
    gpsSatellites = j['gpsSatellites'] ?? 0;
    gpsHdop = (j['gpsHdop'] ?? 99.9).toDouble();
    gpsRejectReason = j['gpsRejectReason'] ?? 'waiting';

    gpsCurrentFix = j['gpsCurrentFix'] ?? false;
    hasLastKnownLocation = j['hasLastKnownLocation'] ?? false;

    distanceToBaseM = (j['distanceToBaseM'] ?? 0).toDouble();
    bearingFromBaseDeg = (j['bearingFromBaseDeg'] ?? 0).toDouble();
    movementBearingDeg = (j['movementBearingDeg'] ?? 0).toDouble();

    directionFromBase = j['directionFromBase'] ?? 'N';
    movementDirection = j['movementDirection'] ?? 'N';
    gpsSource = j['gpsSource'] ?? 'NO_GPS';

    bpm = j['bpm'] ?? 0;
    battery = j['battery'] ?? 0;
    armbandBattery = j['armbandBattery'] ?? 0;
    sos = j['sos'] ?? 0;
    rssi = j['rssi'] ?? 0;
    snr = (j['snr'] ?? 0).toDouble();

    wifiReady = j['wifiReady'] ?? false;
    loraReady = j['loraReady'] ?? false;
    armbandConnected = j['armbandConnected'] ?? false;
    sensorAttached = j['sensorAttached'] ?? false;

    baseMsgSeq = j['baseMsgSeq'] ?? 0;
    lastBaseMessage = j['lastBaseMessage'] ?? 'No message yet';
    lastSentMessage = j['lastSentMessage'] ?? 'No message sent';
  }
}

class ConversationMessage {
  final String from;
  final String text;
  final String time;

  ConversationMessage(this.from, this.text, this.time);
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final String baseUrl = 'http://192.168.4.1';
  final TextEditingController messageController = TextEditingController();

  DeviceStatus status = DeviceStatus();

  bool espConnected = false;
  bool bluetoothOn = false;
  bool armbandSeen = false;
  bool heartSensorSeen = false;
  bool locationReady = false;

  bool statusBusy = false;
  bool sendingGps = false;
  bool sendingBpm = false;
  bool sendingMessage = false;

  int phoneBpm = 0;
  int armbandBattery = 0;
  int lastPostedBpm = -1;
  int failCount = 0;
  int lastSeenBaseSeq = -1;
  String lastShownBaseMessage = '';

  double phoneLat = 0;
  double phoneLon = 0;
  double phoneAlt = 0;

  DateTime lastSuccessfulEsp = DateTime.fromMillisecondsSinceEpoch(0);
  DateTime lastGpsPostTime = DateTime.fromMillisecondsSinceEpoch(0);
  DateTime lastBpmPostTime = DateTime.fromMillisecondsSinceEpoch(0);
  DateTime lastArmbandSeen = DateTime.fromMillisecondsSinceEpoch(0);

  String infoText = 'Starting...';

  final List<ConversationMessage> conversation = [];

  Timer? statusTimer;
  Timer? gpsTimer;
  Timer? bleTimer;
  Timer? watchdogTimer;

  StreamSubscription<List<ScanResult>>? scanSubscription;
  StreamSubscription<BluetoothAdapterState>? bluetoothSubscription;

  @override
  void initState() {
    super.initState();
    startApp();
  }

  Future<void> startApp() async {
    await requestPermissions();
    await prepareLocation();

    bluetoothSubscription = FlutterBluePlus.adapterState.listen((state) {
      bluetoothOn = state == BluetoothAdapterState.on;
      if (bluetoothOn) {
        scanForArmband();
      } else {
        clearArmband();
      }
      if (mounted) setState(() {});
    });

    scanSubscription = FlutterBluePlus.scanResults.listen(handleScanResults);

    await updatePhoneGps();
    await postGpsToEsp32();
    await fetchStatus();

    statusTimer = Timer.periodic(const Duration(seconds: kStatusRefreshSec), (_) => fetchStatus());

    gpsTimer = Timer.periodic(const Duration(seconds: kGpsPostSec), (_) async {
      await updatePhoneGps();
      await postGpsToEsp32();
    });

    bleTimer = Timer.periodic(const Duration(seconds: kBleScanEverySec), (_) => scanForArmband());

    watchdogTimer = Timer.periodic(const Duration(seconds: 1), (_) => runWatchdog());
  }

  Future<void> requestPermissions() async {
    await [
      perm.Permission.bluetoothScan,
      perm.Permission.bluetoothConnect,
      perm.Permission.locationWhenInUse,
    ].request();
  }

  Future<void> prepareLocation() async {
    final enabled = await Geolocator.isLocationServiceEnabled();
    if (!enabled) {
      locationReady = false;
      infoText = 'Phone GPS is OFF';
      return;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }

    locationReady = permission == LocationPermission.always ||
        permission == LocationPermission.whileInUse;
  }

  void runWatchdog() {
    final now = DateTime.now();
    bool changed = false;

    if (espConnected &&
        now.difference(lastSuccessfulEsp).inSeconds > kEspDisconnectedAfterSec) {
      espConnected = false;
      infoText = 'Disconnected from climber ESP32 Wi-Fi/API';
      changed = true;
    }

    if (armbandSeen &&
        now.difference(lastArmbandSeen).inSeconds > kArmbandLostAfterSec) {
      clearArmband();
      postBpmToEsp32(force: true);
      changed = true;
    }

    if (changed && mounted) setState(() {});
  }

  void clearArmband() {
    armbandSeen = false;
    heartSensorSeen = false;
    phoneBpm = 0;
    armbandBattery = 0;
  }

  Future<void> updatePhoneGps() async {
    if (!locationReady || sendingMessage) return;

    try {
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 3),
        ),
      );

      phoneLat = pos.latitude;
      phoneLon = pos.longitude;
      phoneAlt = pos.altitude;

      if (mounted) setState(() {});
    } catch (_) {
      try {
        final pos = await Geolocator.getLastKnownPosition();
        if (pos != null) {
          phoneLat = pos.latitude;
          phoneLon = pos.longitude;
          phoneAlt = pos.altitude;
          if (mounted) setState(() {});
        }
      } catch (_) {}
    }
  }

  Future<void> postGpsToEsp32() async {
    if (sendingGps || sendingMessage || statusBusy) return;
    if (phoneLat == 0 || phoneLon == 0) return;

    sendingGps = true;

    try {
      final res = await http
          .post(
            Uri.parse('$baseUrl/gps'),
            headers: {'Content-Type': 'application/json', 'Connection': 'close'},
            body: jsonEncode({'lat': phoneLat, 'lon': phoneLon, 'alt': phoneAlt}),
          )
          .timeout(const Duration(milliseconds: 900));

      if (res.statusCode == 200) {
        lastGpsPostTime = DateTime.now();
        lastSuccessfulEsp = DateTime.now();
        espConnected = true;
        failCount = 0;
      }
    } catch (_) {}

    sendingGps = false;
  }

  void handleScanResults(List<ScanResult> results) {
    bool found = false;

    for (final r in results) {
      final advName = r.advertisementData.advName;
      final platformName = r.device.platformName;
      final name = advName.isNotEmpty ? advName : platformName;

      if (name != 'CLIMBER_ARMBAND') continue;

      final data = parseArmbandData(r.advertisementData.manufacturerData);

      armbandSeen = true;
      found = true;
      lastArmbandSeen = DateTime.now();

      phoneBpm = data['bpm'] ?? 0;
      heartSensorSeen = data['sensor'] == 1;
      armbandBattery = data['bat'] ?? 0;

      maybePostBpmToEsp32();
      break;
    }

    if (!found) {
      final now = DateTime.now();
      if (armbandSeen &&
          now.difference(lastArmbandSeen).inSeconds > kArmbandLostAfterSec) {
        clearArmband();
        postBpmToEsp32(force: true);
      }
    }

    if (mounted) setState(() {});
  }

  Map<String, int> parseArmbandData(Map<int, List<int>> manufacturerData) {
    int bpm = 0;
    int sensor = 0;
    int bat = 0;

    for (final bytes in manufacturerData.values) {
      final text = utf8.decode(bytes, allowMalformed: true);

      final bpmMatch = RegExp(r'BPM:(\d+)').firstMatch(text);
      final sensorMatch = RegExp(r'SEN:(\d+)').firstMatch(text);
      final batMatch = RegExp(r'BAT:(\d+)').firstMatch(text);

      if (bpmMatch != null) bpm = int.tryParse(bpmMatch.group(1) ?? '0') ?? 0;
      if (sensorMatch != null) sensor = int.tryParse(sensorMatch.group(1) ?? '0') ?? 0;
      if (batMatch != null) bat = int.tryParse(batMatch.group(1) ?? '0') ?? 0;
    }

    return {'bpm': bpm, 'sensor': sensor, 'bat': bat};
  }

  Future<void> scanForArmband() async {
    if (!bluetoothOn) return;

    try {
      await FlutterBluePlus.stopScan();
      await FlutterBluePlus.startScan(
        timeout: const Duration(seconds: kBleScanDurationSec),
        androidUsesFineLocation: true,
      );
    } catch (_) {}
  }

  void maybePostBpmToEsp32() {
    final now = DateTime.now();

    if (phoneBpm == lastPostedBpm &&
        now.difference(lastBpmPostTime).inSeconds < 5) {
      return;
    }

    postBpmToEsp32();
  }

  Future<void> postBpmToEsp32({bool force = false}) async {
    if (sendingBpm || sendingMessage || statusBusy) return;

    if (!force &&
        phoneBpm == lastPostedBpm &&
        DateTime.now().difference(lastBpmPostTime).inSeconds < 5) {
      return;
    }

    sendingBpm = true;

    try {
      final res = await http
          .post(
            Uri.parse('$baseUrl/bpm'),
            headers: {'Content-Type': 'application/json', 'Connection': 'close'},
            body: jsonEncode({
              'bpm': armbandSeen ? phoneBpm : 0,
              'arm': armbandSeen ? 1 : 0,
              'sensor': heartSensorSeen ? 1 : 0,
              'abat': armbandSeen ? armbandBattery : 0,
            }),
          )
          .timeout(const Duration(milliseconds: 900));

      if (res.statusCode == 200) {
        lastBpmPostTime = DateTime.now();
        lastPostedBpm = phoneBpm;
        lastSuccessfulEsp = DateTime.now();
        espConnected = true;
        failCount = 0;
      }
    } catch (_) {}

    sendingBpm = false;
  }

  Future<void> fetchStatus() async {
    if (statusBusy || sendingMessage) return;
    statusBusy = true;

    try {
      final res = await http
          .get(
            Uri.parse('$baseUrl/status'),
            headers: {'Connection': 'close', 'Cache-Control': 'no-cache'},
          )
          .timeout(const Duration(milliseconds: 900));

      if (res.statusCode != 200) {
        markFailure('ESP32 HTTP error');
        statusBusy = false;
        return;
      }

      status = DeviceStatus.fromJson(jsonDecode(res.body));
      espConnected = true;
      failCount = 0;
      lastSuccessfulEsp = DateTime.now();

      if (status.gpsCurrentFix) {
        infoText = status.gpsSource == 'NEO6M'
            ? 'NEO-6M GPS tracking active.'
            : 'Phone GPS fallback active.';
      } else if (status.hasLastKnownLocation) {
        infoText = 'NO GPS FIX. Showing last known location.';
      } else {
        infoText = 'NO GPS FOUND. Waiting for NEO-6M or phone GPS.';
      }

      checkBaseMessage();

      if (mounted) setState(() {});
    } catch (_) {
      markFailure('Waiting for ESP32 response...');
    }

    statusBusy = false;
  }

  void checkBaseMessage() {
    final msg = status.lastBaseMessage.trim();

    if (msg.isEmpty || msg == 'No message yet') return;

    // Fix: web-dashboard messages sometimes arrived with the same/late sequence timing.
    // Use both sequence and text to avoid missing basecamp replies, while still blocking duplicates.
    final isNewSeq = status.baseMsgSeq != lastSeenBaseSeq;
    final isNewText = msg != lastShownBaseMessage;

    if (!isNewSeq && !isNewText) return;

    lastSeenBaseSeq = status.baseMsgSeq;
    lastShownBaseMessage = msg;

    addConversation('Base', msg);
  }

  void markFailure(String msg) {
    failCount++;

    final sec = DateTime.now().difference(lastSuccessfulEsp).inSeconds;

    if (failCount >= 2 && sec > kEspDisconnectedAfterSec) {
      espConnected = false;
      infoText = msg;

      if (mounted) setState(() {});
    }
  }

  Future<bool> postToEsp32(String endpoint, Map<String, dynamic> body) async {
    try {
      final res = await http
          .post(
            Uri.parse('$baseUrl/$endpoint'),
            headers: {'Content-Type': 'application/json', 'Connection': 'close'},
            body: jsonEncode(body),
          )
          .timeout(const Duration(milliseconds: 1200));

      if (res.statusCode == 200) {
        failCount = 0;
        espConnected = true;
        lastSuccessfulEsp = DateTime.now();
        return true;
      }
    } catch (_) {}

    return false;
  }

  void addConversation(String from, String text) {
    final now = DateTime.now();
    final hh = now.hour.toString().padLeft(2, '0');
    final mm = now.minute.toString().padLeft(2, '0');

    conversation.add(ConversationMessage(from, text, '$hh:$mm'));

    while (conversation.length > 5) {
      conversation.removeAt(0);
    }
  }


  Future<void> sendQuickMessage(String text) async {
    if (sendingMessage) return;
    messageController.text = text;
    await sendMessage();
  }

  Future<void> sendMessage() async {
    final text = messageController.text.trim();

    if (text.isEmpty || sendingMessage) return;

    sendingMessage = true;
    messageController.clear();

    addConversation('Me', text);
    infoText = 'Sending message...';

    if (mounted) setState(() {});

    final ok = await postToEsp32('send', {'message': text});

    infoText = ok ? 'Message queued' : 'Message failed';

    sendingMessage = false;

    Future.delayed(const Duration(seconds: 1), fetchStatus);

    if (mounted) setState(() {});
  }

  Future<void> sendSos() async {
    if (sendingMessage) return;

    sendingMessage = true;

    addConversation('Me', 'SOS EMERGENCY');
    infoText = 'Sending SOS...';

    if (mounted) setState(() {});

    final ok = await postToEsp32('sos', {});

    infoText = ok ? 'SOS queued' : 'SOS failed';

    sendingMessage = false;

    Future.delayed(const Duration(seconds: 1), fetchStatus);

    if (mounted) setState(() {});
  }

  Future<void> clearSos() async {
    if (sendingMessage) return;

    sendingMessage = true;

    addConversation('Me', 'SOS CLEARED');
    infoText = 'Clearing SOS...';

    if (mounted) setState(() {});

    final ok = await postToEsp32('clear-sos', {});

    infoText = ok ? 'Clear SOS queued' : 'Clear SOS failed';

    sendingMessage = false;

    Future.delayed(const Duration(seconds: 1), fetchStatus);

    if (mounted) setState(() {});
  }

  String formatDistance(double meters) {
    if (meters <= 0) return '0 m';
    if (meters < 1000) return '${meters.toStringAsFixed(1)} m';
    return '${(meters / 1000).toStringAsFixed(2)} km';
  }

  Color statusColor() {
    if (!espConnected) return const Color(0xFF6B7280);
    if (status.sos == 1) return const Color(0xFFDC2626);
    if (!status.gpsCurrentFix && status.hasLastKnownLocation) {
      return const Color(0xFFF97316);
    }
    if (!status.gpsCurrentFix) return const Color(0xFFDC2626);
    return const Color(0xFF16A34A);
  }

  String mainStatusText() {
    if (!espConnected) return 'DISCONNECTED';
    if (status.sos == 1) return 'SOS ACTIVE';
    if (!status.gpsCurrentFix && status.hasLastKnownLocation) return 'LAST KNOWN';
    if (!status.gpsCurrentFix) return 'NO GPS FOUND';
    return 'SAFE';
  }

  @override
  void dispose() {
    statusTimer?.cancel();
    gpsTimer?.cancel();
    bleTimer?.cancel();
    watchdogTimer?.cancel();
    scanSubscription?.cancel();
    bluetoothSubscription?.cancel();
    messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final shownBpm = status.bpm != 0 ? status.bpm : phoneBpm;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Climber Safety'),
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await updatePhoneGps();
          await postGpsToEsp32();
          await fetchStatus();
          await scanForArmband();
        },
        child: ListView(
          padding: const EdgeInsets.all(14),
          children: [
            statusPanel(),
            const SizedBox(height: 12),
            simpleGrid([
              item('Distance', formatDistance(status.distanceToBaseM), Icons.route),
              item('From Base', status.directionFromBase, Icons.explore),
              item('GPS', status.gpsSource, Icons.gps_fixed),
              item('LoRa', status.loraReady ? 'OK' : 'FAIL', Icons.sensors),
              item('Main Batt', '${status.battery}%', Icons.battery_full),
              item('Arm Batt', '${status.armbandBattery}%', Icons.watch),
            ]),
            const SizedBox(height: 12),
            mapPanel(),
            const SizedBox(height: 12),
            gpsPanel(),
            const SizedBox(height: 12),
            healthPanel(shownBpm),
            const SizedBox(height: 12),
            conversationPanel(),
            const SizedBox(height: 12),
            messagePanel(),
            const SizedBox(height: 12),
            sosPanel(),
            const SizedBox(height: 12),
            devicePanel(),
          ],
        ),
      ),
    );
  }

  Widget statusPanel() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: statusColor(),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          Text(
            mainStatusText(),
            style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          Text(
            infoText,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white),
          ),
          const SizedBox(height: 10),
          Text(
            '${formatDistance(status.distanceToBaseM)} ${status.directionFromBase} from base',
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget mapPanel() {
    final displayLat = status.gpsCurrentFix ? status.lat : status.lastKnownLat;
    final displayLon = status.gpsCurrentFix ? status.lon : status.lastKnownLon;

    return section(
      title: 'Distance Map',
      icon: Icons.map,
      children: [
        SizedBox(
          height: 260,
          width: double.infinity,
          child: CustomPaint(
            painter: DistanceMapPainter(
              baseLat: status.baseLat,
              baseLon: status.baseLon,
              climberLat: displayLat,
              climberLon: displayLon,
              distanceM: status.distanceToBaseM,
              direction: status.directionFromBase,
              gpsFix: status.gpsCurrentFix,
              hasLastKnown: status.hasLastKnownLocation,
            ),
          ),
        ),
        const SizedBox(height: 8),
        row('Map Type', 'Distance sketch'),
        row('Point B', 'Basecamp'),
        row('Point C', status.gpsCurrentFix ? 'Current climber' : 'Last known climber'),
      ],
    );
  }

  Widget gpsPanel() {
    final displayLat = status.gpsCurrentFix ? status.lat : status.lastKnownLat;
    final displayLon = status.gpsCurrentFix ? status.lon : status.lastKnownLon;

    return section(
      title: 'GPS Tracking',
      icon: Icons.gps_fixed,
      children: [
        row('GPS Source', status.gpsSource),
        row('GPS Fix', status.gpsCurrentFix ? 'Current fix' : 'No current fix'),
        row('GPS Age', '${(status.gpsAgeMs / 1000).round()} s'),
        row('Satellites', status.gpsSatellites.toString()),
        row('HDOP', status.gpsHdop.toStringAsFixed(1)),
        row('GPS Filter', status.gpsRejectReason),
        row('Last Known', status.hasLastKnownLocation ? 'Available' : 'None'),
        row('Last Known Age', '${(status.lastKnownAgeMs / 1000).round()} s'),
        row('Phone GPS Fallback', locationReady ? 'Ready' : 'Not ready'),
        row('Basecamp', '${status.baseLat.toStringAsFixed(6)}, ${status.baseLon.toStringAsFixed(6)}'),
        row('Climber', '${displayLat.toStringAsFixed(6)}, ${displayLon.toStringAsFixed(6)}'),
        row('Altitude', '${status.altitude.toStringAsFixed(1)} m'),
      ],
    );
  }

  Widget healthPanel(int shownBpm) {
    return section(
      title: 'Health + Armband',
      icon: Icons.favorite,
      children: [
        row('Bluetooth', bluetoothOn ? 'ON' : 'OFF'),
        row('Armband', armbandSeen ? 'Detected' : 'Disconnected'),
        row('Last Armband Seen', armbandSeen ? 'now' : 'not active'),
        row('Heart Sensor', heartSensorSeen ? 'Connected' : 'Missing'),
        row('BPM', shownBpm.toString()),
        row('Armband Battery', '${status.armbandBattery}%'),
      ],
    );
  }

  Widget conversationPanel() {
    return section(
      title: 'Conversation',
      icon: Icons.forum,
      children: [
        if (conversation.isEmpty)
          const Text('No conversation yet', style: TextStyle(color: Color(0xFF64748B)))
        else
          ...conversation.map((m) {
            final isMe = m.from == 'Me';
            return Container(
              width: double.infinity,
              margin: const EdgeInsets.symmetric(vertical: 4),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isMe ? const Color(0xFFFFE4E6) : const Color(0xFFDBEAFE),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${m.from} • ${m.time}\n${m.text}',
                style: const TextStyle(fontWeight: FontWeight.w500),
              ),
            );
          }),
      ],
    );
  }

  Widget messagePanel() {
    return section(
      title: 'Send Message',
      icon: Icons.send,
      children: [
        const Text('Quick messages', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            quickChip('I am OK'),
            quickChip('Need help'),
            quickChip('Injured'),
            quickChip('Lost path'),
            quickChip('Low battery'),
            quickChip('Returning to base'),
            quickChip('Reached checkpoint'),
          ],
        ),
        const SizedBox(height: 12),
        TextField(
          controller: messageController,
          maxLength: 120,
          enabled: !sendingMessage,
          decoration: const InputDecoration(
            labelText: 'Message to basecamp',
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: FilledButton.icon(
            onPressed: sendingMessage ? null : sendMessage,
            icon: const Icon(Icons.send),
            label: Text(sendingMessage ? 'Sending...' : 'Send'),
          ),
        ),
        const SizedBox(height: 8),
        row('Last base message', status.lastBaseMessage),
      ],
    );
  }


  Widget quickChip(String text) {
    return ActionChip(
      label: Text(text, overflow: TextOverflow.ellipsis),
      onPressed: sendingMessage ? null : () => sendQuickMessage(text),
      avatar: const Icon(Icons.flash_on, size: 18),
    );
  }

  Widget sosPanel() {
    return Column(
      children: [
        SizedBox(
          height: 56,
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: sendingMessage ? null : sendSos,
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
            ),
            icon: const Icon(Icons.warning),
            label: const Text('SEND SOS'),
          ),
        ),
        if (status.sos == 1) ...[
          const SizedBox(height: 8),
          SizedBox(
            height: 50,
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: sendingMessage ? null : clearSos,
              icon: const Icon(Icons.check_circle),
              label: const Text('CLEAR SOS'),
            ),
          ),
        ],
      ],
    );
  }

  Widget devicePanel() {
    return section(
      title: 'Device',
      icon: Icons.info_outline,
      children: [
        row('ESP32 API', espConnected ? 'Connected' : 'Disconnected'),
        row('Wi-Fi AP', status.wifiReady ? 'OK' : 'FAIL'),
        row('Main Battery', '${status.battery}%'),
        row('RSSI', '${status.rssi} dBm'),
        row('SNR', status.snr.toStringAsFixed(1)),
        row('Fail count', failCount.toString()),
      ],
    );
  }

  Widget simpleGrid(List<Widget> children) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final cardWidth = (constraints.maxWidth - 10) / 2;
        return Wrap(
          spacing: 10,
          runSpacing: 10,
          children: children
              .map((child) => SizedBox(
                    width: cardWidth < 145 ? constraints.maxWidth : cardWidth,
                    child: child,
                  ))
              .toList(),
        );
      },
    );
  }

  Widget item(String title, String value, IconData icon) {
    return Container(
      constraints: const BoxConstraints(minHeight: 98),
      padding: const EdgeInsets.all(12),
      decoration: cardDecoration(),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: statusColor(), size: 22),
          const SizedBox(height: 8),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 19, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget section({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: const Color(0xFF0F172A)),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 10),
          ...children,
        ],
      ),
    );
  }

  Widget row(String left, String right) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 4,
            child: Text(
              left,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(color: Color(0xFF64748B)),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            flex: 5,
            child: Text(
              right,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.right,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  BoxDecoration cardDecoration() {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
    );
  }
}


class DistanceMapPainter extends CustomPainter {
  final double baseLat;
  final double baseLon;
  final double climberLat;
  final double climberLon;
  final double distanceM;
  final String direction;
  final bool gpsFix;
  final bool hasLastKnown;

  DistanceMapPainter({
    required this.baseLat,
    required this.baseLon,
    required this.climberLat,
    required this.climberLon,
    required this.distanceM,
    required this.direction,
    required this.gpsFix,
    required this.hasLastKnown,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final bg = Paint()..color = const Color(0xFFE0F2FE);
    final grid = Paint()
      ..color = const Color(0xFFBAE6FD)
      ..strokeWidth = 1;
    final basePaint = Paint()..color = const Color(0xFF1E3A8A);
    final climberPaint = Paint()..color = gpsFix ? const Color(0xFF16A34A) : const Color(0xFFF97316);
    final linePaint = Paint()
      ..color = const Color(0xFF334155)
      ..strokeWidth = 3;

    final rect = RRect.fromRectAndRadius(Offset.zero & size, const Radius.circular(14));
    canvas.drawRRect(rect, bg);

    for (int i = 1; i < 4; i++) {
      final x = size.width * i / 4;
      final y = size.height * i / 4;
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), grid);
      canvas.drawLine(Offset(0, y), Offset(size.width, y), grid);
    }

    final base = Offset(size.width / 2, size.height / 2);

    if (baseLat == 0 || baseLon == 0 || climberLat == 0 || climberLon == 0) {
      _drawPoint(canvas, base, basePaint, 'B');
      _drawText(canvas, 'NO GPS LOCATION', Offset(18, 24), 16, const Color(0xFFDC2626), bold: true);
      _drawText(canvas, 'Waiting for NEO-6M or phone GPS', Offset(18, 48), 12, const Color(0xFF475569));
      return;
    }

    final dxMeters = (climberLon - baseLon) * 111320 * cos(baseLat * pi / 180);
    final dyMeters = (climberLat - baseLat) * 110540;
    final radiusM = max(kMapMinRadiusM, max(dxMeters.abs(), dyMeters.abs()) * 1.4 + 1);

    var climber = Offset(
      base.dx + (dxMeters / radiusM) * (size.width / 2 - 32),
      base.dy - (dyMeters / radiusM) * (size.height / 2 - 32),
    );

    climber = Offset(
      climber.dx.clamp(24.0, size.width - 24.0),
      climber.dy.clamp(24.0, size.height - 24.0),
    );

    canvas.drawLine(base, climber, linePaint);
    _drawPoint(canvas, base, basePaint, 'B');
    _drawPoint(canvas, climber, climberPaint, 'C');

    final mid = Offset((base.dx + climber.dx) / 2, (base.dy + climber.dy) / 2);
    _drawText(canvas, _formatDistance(distanceM), mid + const Offset(8, -8), 13, const Color(0xFF0F172A), bold: true);
    _drawText(canvas, direction, mid + const Offset(8, 10), 12, const Color(0xFF334155));

    _drawText(canvas, 'B = Basecamp', const Offset(14, 20), 12, const Color(0xFF334155));
    _drawText(canvas, gpsFix ? 'C = Current GPS' : 'C = Last known', const Offset(14, 38), 12, gpsFix ? const Color(0xFF166534) : const Color(0xFFC2410C));
    _drawText(canvas, 'Radius ±${radiusM.toStringAsFixed(0)}m', const Offset(14, 56), 12, const Color(0xFF475569));
  }

  void _drawPoint(Canvas canvas, Offset p, Paint paint, String label) {
    canvas.drawCircle(p, 16, paint);
    _drawText(canvas, label, p + const Offset(-5, 5), 15, Colors.white, bold: true);
  }

  void _drawText(Canvas canvas, String text, Offset p, double size, Color color, {bool bold = false}) {
    final tp = TextPainter(
      text: TextSpan(
        text: text,
        style: TextStyle(color: color, fontSize: size, fontWeight: bold ? FontWeight.bold : FontWeight.normal),
      ),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    );
    tp.layout(maxWidth: 220);
    tp.paint(canvas, p);
  }

  String _formatDistance(double meters) {
    if (meters <= 0) return '0 m';
    if (meters < 1000) return '${meters.toStringAsFixed(1)} m';
    return '${(meters / 1000).toStringAsFixed(2)} km';
  }

  @override
  bool shouldRepaint(covariant DistanceMapPainter oldDelegate) {
    return oldDelegate.baseLat != baseLat ||
        oldDelegate.baseLon != baseLon ||
        oldDelegate.climberLat != climberLat ||
        oldDelegate.climberLon != climberLon ||
        oldDelegate.distanceM != distanceM ||
        oldDelegate.gpsFix != gpsFix ||
        oldDelegate.hasLastKnown != hasLastKnown;
  }
}
