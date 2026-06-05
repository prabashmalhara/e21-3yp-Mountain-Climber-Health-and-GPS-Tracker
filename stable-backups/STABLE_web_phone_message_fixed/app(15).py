from flask import Flask, render_template_string, request, jsonify, Response
import serial
import threading
import time
import math
import json

# ===================== CONFIG =====================
SERIAL_PORT = "COM30"   # Change this if your basecamp ESP32 uses another COM port.
BAUD_RATE = 115200

BASE_NAME = "BASE CAMP"
base_lat = 7.253061
base_lon = 80.592154
base_alt = 0.0
base_source = "DEFAULT"
base_updated_at = int(time.time())
base_location_seq = 1

# Fast dashboard state timing.
ONLINE_TIMEOUT_S = 25          # shows climber offline faster if no LoRa packets
NO_PACKET_WARNING_S = 12
MAP_MIN_RADIUS_M = 250.0
PATH_MIN_MOVE_M = 15.0

app = Flask(__name__)

ser = None
serial_status = "Serial not connected"
serial_lock = threading.Lock()

climbers = {}
messages = []
event_log = []
pending_commands = []
seen_message_ids = set()


# ===================== HELPERS =====================
def now_time():
    return time.strftime("%H:%M:%S")


def add_event(level, source, event, details=""):
    row = {
        "time": now_time(),
        "level": str(level or "INFO"),
        "source": str(source or "SYSTEM"),
        "event": str(event or ""),
        "details": str(details or ""),
    }

    event_log.append(row)

    if len(event_log) > 1000:
        del event_log[:300]


def extract(packet, key):
    marker = key + ":"
    if marker not in packet:
        return ""

    s = packet.find(marker) + len(marker)
    e = packet.find(",", s)

    if e == -1:
        e = len(packet)

    return packet[s:e]


def packet_text(packet):
    # Return only the user-readable message part. Never show telemetry/raw packet in chat.
    packet = str(packet or "")

    for marker in ["TEXT:", "MSG:", "TXT:"]:
        if marker in packet:
            txt = packet.split(marker, 1)[1].strip()

            # If telemetry fields were accidentally appended, cut them.
            for cut in [",LAT:", ",LON:", ",ALT:", ",GPS:", ",FIX:", ",LK:", ",BAT:", ",SOS:", ",BLE:", ",SEN:"]:
                if cut in txt:
                    txt = txt.split(cut, 1)[0].strip()

            if len(txt) >= 2 and txt[0] == '"' and txt[-1] == '"':
                txt = txt[1:-1].strip()

            return txt[:160] if txt else ""

    if "TYPE:SOS_CLEAR" in packet:
        return "SOS cleared"
    if "TYPE:SOS" in packet:
        return "SOS EMERGENCY"

    return ""


def add_chat(sender, text):
    text = str(text or "").strip()
    if not text:
        return

    # Extra protection: if anything raw reaches here, try to clean it.
    if "TYPE:" in text:
        text = packet_text(text)

    if not text:
        return

    # Do not show placeholder messages in conversation.
    bad_placeholders = {"message received", "received", "msg received"}
    if text.strip().lower() in bad_placeholders:
        return

    # Prevent exact duplicate consecutive chat rows.
    if messages:
        last = messages[-1]
        if last.get("sender") == sender and last.get("text") == text:
            return

    messages.append({"sender": sender, "text": text[:160], "time": now_time()})
    add_event("MESSAGE", sender, "Chat", text[:160])


def to_float(v, default=0.0):
    try:
        return float(v)
    except Exception:
        return default


def to_int(v, default=0):
    try:
        return int(v)
    except Exception:
        return default


def haversine_m(lat1, lon1, lat2, lon2):
    if lat1 == 0 and lon1 == 0:
        return 0.0

    if lat2 == 0 and lon2 == 0:
        return 0.0

    r = 6371000.0
    p1 = math.radians(lat1)
    p2 = math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)

    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return r * c


def bearing_deg(lat1, lon1, lat2, lon2):
    if lat1 == 0 and lon1 == 0:
        return 0.0

    if lat2 == 0 and lon2 == 0:
        return 0.0

    p1 = math.radians(lat1)
    p2 = math.radians(lat2)
    dl = math.radians(lon2 - lon1)

    y = math.sin(dl) * math.cos(p2)
    x = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)

    brng = math.degrees(math.atan2(y, x))
    return (brng + 360) % 360


def direction_text(deg):
    dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    idx = round(deg / 45) % 8
    return dirs[idx]


def is_duplicate_packet(packet):
    mid = extract(packet, "MID")

    if not mid:
        return False

    if mid in seen_message_ids:
        return True

    seen_message_ids.add(mid)

    if len(seen_message_ids) > 300:
        seen_message_ids.clear()

    return False


def get_climber(cid):
    if cid not in climbers:
        climbers[cid] = {
            "id": cid,
            "lat": 0.0,
            "lon": 0.0,
            "alt": 0.0,
            "gps": "NO_GPS",
            "gps_fix": 0,
            "gps_age_s": 0,
            "gps_satellites": 0,
            "gps_hdop": 99.9,
            "gps_reject": "waiting",
            "has_last_known": 0,
            "last_known_lat": 0.0,
            "last_known_lon": 0.0,
            "last_known_age_s": 0,
            "bpm": 0,
            "battery": 0,
            "armband_battery": 0,
            "sos": 0,
            "ble": 0,
            "sen": 0,
            "rssi": 0,
            "snr": 0.0,
            "last_seen": 0,
            "last_packet": "No packet yet",
            "last_message": "No message yet",
            "last_reply": "No reply sent yet",
            "base_seq_seen": 0,
            "distance_m": 0.0,
            "bearing_deg": 0.0,
            "direction": "N",
            "move_bearing": 0.0,
            "move_direction": "N",
            "path": [],
        }

    return climbers[cid]


def add_path_point(c):
    lat = c["lat"]
    lon = c["lon"]

    if lat == 0 or lon == 0:
        return

    if c["path"]:
        last = c["path"][-1]
        moved = haversine_m(last["lat"], last["lon"], lat, lon)

        # Avoid drawing messy scribbles caused by normal GPS jitter.
        if moved < PATH_MIN_MOVE_M:
            return

        # If GPS jumps unrealistically while still reporting, do not add it to the path.
        if moved > 120 and c.get("gps_age_s", 0) < 10:
            return

        c["move_bearing"] = bearing_deg(last["lat"], last["lon"], lat, lon)
        c["move_direction"] = direction_text(c["move_bearing"])

    c["path"].append({
        "lat": lat,
        "lon": lon,
        "time": now_time(),
    })

    if len(c["path"]) > 80:
        c["path"] = c["path"][-80:]


def update_distance(c):
    lat = c["lat"]
    lon = c["lon"]

    # If current GPS has timed out, use last known location for display.
    if c["gps_fix"] != 1 and c["has_last_known"] == 1:
        lat = c["last_known_lat"]
        lon = c["last_known_lon"]

    c["distance_m"] = haversine_m(base_lat, base_lon, lat, lon)
    c["bearing_deg"] = bearing_deg(base_lat, base_lon, lat, lon)
    c["direction"] = direction_text(c["bearing_deg"])


def normalize_gps_state(c):
    # The climber firmware sends GPS=NO_FIX_LAST_KNOWN when current fix is stale.
    if c["gps"] == "NEO6M" or c["gps"] == "PHONE":
        c["gps_fix"] = 1
    else:
        c["gps_fix"] = 0

    if c["gps"] == "NO_FIX_LAST_KNOWN":
        c["has_last_known"] = 1

    if c["gps"] == "NO_GPS":
        c["gps_fix"] = 0


def update_climber_from_packet(cid, packet, rssi, snr):
    c = get_climber(cid)

    c["last_packet"] = packet
    c["rssi"] = rssi
    c["snr"] = snr
    c["last_seen"] = int(time.time())

    gps = extract(packet, "GPS")
    if gps:
        c["gps"] = gps

    c["gps_fix"] = to_int(extract(packet, "FIX"), c["gps_fix"])
    c["gps_age_s"] = to_int(extract(packet, "GAGE"), c["gps_age_s"])
    c["gps_satellites"] = to_int(extract(packet, "SAT"), c["gps_satellites"])
    c["gps_hdop"] = to_float(extract(packet, "HDOP"), c["gps_hdop"])
    grej = extract(packet, "GREJ")
    if grej:
        c["gps_reject"] = grej

    c["has_last_known"] = to_int(extract(packet, "LK"), c["has_last_known"])
    c["last_known_age_s"] = to_int(extract(packet, "LKAGE"), c["last_known_age_s"])
    c["last_known_lat"] = to_float(extract(packet, "LKLAT"), c["last_known_lat"])
    c["last_known_lon"] = to_float(extract(packet, "LKLON"), c["last_known_lon"])

    normalize_gps_state(c)

    old_lat = c["lat"]
    old_lon = c["lon"]

    new_lat = to_float(extract(packet, "LAT"), c["lat"])
    new_lon = to_float(extract(packet, "LON"), c["lon"])
    new_alt = to_float(extract(packet, "ALT"), c["alt"])

    # Never overwrite valid coordinates with zero.
    if new_lat != 0 and new_lon != 0:
        c["lat"] = new_lat
        c["lon"] = new_lon
        c["alt"] = new_alt

    c["bpm"] = to_int(extract(packet, "BPM"), c["bpm"])
    c["battery"] = to_int(extract(packet, "BAT"), c["battery"])
    c["armband_battery"] = to_int(extract(packet, "ABAT"), c["armband_battery"])
    c["sos"] = to_int(extract(packet, "SOS"), c["sos"])
    c["ble"] = to_int(extract(packet, "BLE"), c["ble"])
    c["sen"] = to_int(extract(packet, "SEN"), c["sen"])

    bseq = extract(packet, "BSEQ")
    if bseq:
        c["base_seq_seen"] = to_int(bseq, c["base_seq_seen"])

    update_distance(c)

    if old_lat != c["lat"] or old_lon != c["lon"]:
        add_path_point(c)

    if "TYPE:SOS_CLEAR" in packet:
        if is_duplicate_packet(packet):
            return

        c["sos"] = 0
        c["last_message"] = "SOS cleared by climber"
        add_event("INFO", cid, "SOS cleared", "Cleared by climber")
        add_chat(cid, c["last_message"])

    elif "TYPE:SOS" in packet:
        if is_duplicate_packet(packet):
            return

        c["sos"] = 1
        c["last_message"] = "SOS EMERGENCY"
        add_event("CRITICAL", cid, "SOS EMERGENCY", "SOS received from climber")
        add_chat(cid, "SOS EMERGENCY")

    elif "TYPE:MSG" in packet:
        if is_duplicate_packet(packet):
            return

        msg = packet_text(packet)
        if msg:
            c["last_message"] = msg
            add_chat(cid, msg)

    else:
        if c["gps_fix"] == 1:
            c["last_message"] = "Live GPS updated"
        elif c["has_last_known"] == 1:
            c["last_message"] = "No GPS fix - showing last known"
        else:
            c["last_message"] = "No GPS found"


# ===================== SERIAL =====================
def connect_serial_loop():
    global ser, serial_status

    while True:
        try:
            if ser is not None and ser.is_open:
                time.sleep(0.2)
                continue

            ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.15)
            time.sleep(0.5)

            serial_status = f"Connected on {SERIAL_PORT}"
            print(serial_status)

        except Exception as e:
            serial_status = f"Serial failed: {e}"
            print(serial_status)
            time.sleep(0.2)


def send_serial_line(line):
    global ser

    if ser is None or not ser.is_open:
        return False

    try:
        with serial_lock:
            ser.write((line + "\n").encode("utf-8"))
            ser.flush()

        # print("SERIAL TX:", line)
        return True

    except Exception as e:
        print("Serial write failed:", e)

        try:
            if ser:
                ser.close()
        except Exception:
            pass

        ser = None
        return False


def queue_or_send(line, display="", target="ALL"):
    ok = send_serial_line(line)

    if not ok:
        pending_commands.append({
            "line": line,
            "display": display,
            "target": target,
        })

    return ok


def retry_pending_loop():
    while True:
        try:
            if pending_commands:
                item = pending_commands[0]
                ok = send_serial_line(item["line"])

                if ok:
                    pending_commands.pop(0)

            time.sleep(0.5)

        except Exception as e:
            print("Retry error:", e)
            time.sleep(0.5)


def serial_reader_loop():
    global ser, serial_status

    while True:
        try:
            if ser is None or not ser.is_open:
                time.sleep(0.2)
                continue

            line = ser.readline().decode("utf-8", errors="ignore").strip()

            if not line:
                continue

            # print("SERIAL RX:", line)

            if not line.startswith("{"):
                continue

            try:
                data = json.loads(line)
            except Exception:
                continue

            t = data.get("type", "")

            if t == "system":
                serial_status = data.get("message", serial_status)

            elif t == "error":
                serial_status = data.get("message", serial_status)

            elif t == "lora_rx":
                packet = data.get("packet", "")
                cid = data.get("id") or extract(packet, "ID") or extract(packet, "FROM") or "CLIMBER01"

                update_climber_from_packet(
                    cid,
                    packet,
                    data.get("rssi", 0),
                    data.get("snr", 0.0),
                )

            elif t == "lora_tx":
                target = data.get("to", "CLIMBER01")
                packet = data.get("packet", "")

                if "TYPE:BASE" in packet:
                    add_chat("BASE CAMP", "Base GPS sent to climber nodes")
                elif "TYPE:SOS_CLEAR" in packet:
                    get_climber(target)["sos"] = 0
                    add_chat("BASE CAMP", "SOS clear sent")
                else:
                    msg = packet_text(packet)
                    c = get_climber(target)
                    c["last_reply"] = msg
                    add_chat("BASE CAMP", msg)

        except Exception as e:
            print("Serial reader error:", e)

            try:
                if ser:
                    ser.close()
            except Exception:
                pass

            ser = None
            time.sleep(0.2)


def send_base_location_to_lora():
    line = f"BASE|{base_lat:.6f}|{base_lon:.6f}"
    return queue_or_send(line, "base GPS update", "ALL")


def build_alerts(arr):
    alerts = []
    now = int(time.time())

    for c in arr:
        cid = c.get("id", "UNKNOWN")
        online = c.get("online", False)
        sec = c.get("seconds_since", 0)

        if c.get("sos", 0) == 1:
            alerts.append({
                "level": "CRITICAL",
                "id": cid,
                "text": "SOS active",
                "details": f"{cid} requested emergency help",
            })

        if not online:
            alerts.append({
                "level": "WARNING",
                "id": cid,
                "text": "Climber offline",
                "details": f"No LoRa packet for {sec}s",
            })

        if c.get("gps_fix", 0) != 1:
            if c.get("has_last_known", 0) == 1:
                alerts.append({
                    "level": "WARNING",
                    "id": cid,
                    "text": "GPS lost - last known shown",
                    "details": f"Last known age {c.get('last_known_age_s', 0)}s",
                })
            else:
                alerts.append({
                    "level": "CRITICAL",
                    "id": cid,
                    "text": "No GPS found",
                    "details": "No current or previous valid location",
                })

        bat = int(c.get("battery", 0) or 0)
        if bat > 0 and bat < 20:
            alerts.append({
                "level": "WARNING",
                "id": cid,
                "text": "Main battery low",
                "details": f"{bat}%",
            })

        abat = int(c.get("armband_battery", 0) or 0)
        ble = int(c.get("ble", 0) or 0)
        if ble == 1 and abat > 0 and abat < 20:
            alerts.append({
                "level": "WARNING",
                "id": cid,
                "text": "Armband battery low",
                "details": f"{abat}%",
            })

    return alerts


# ===================== ROUTES =====================
@app.route("/")
def index():
    return render_template_string(HTML)


@app.route("/api/status")
def api_status():
    now = int(time.time())
    arr = []

    for c in climbers.values():
        update_distance(c)

        sec = now - c["last_seen"] if c["last_seen"] else 0
        online = c["last_seen"] > 0 and sec < ONLINE_TIMEOUT_S

        arr.append({**c, "online": online, "seconds_since": sec})

    if not arr:
        c = get_climber("CLIMBER01")
        update_distance(c)
        arr.append({**c, "online": False, "seconds_since": 0})

    alerts = build_alerts(arr)

    return jsonify({
        "serial_status": serial_status,
        "basecamp": {
            "name": BASE_NAME,
            "lat": base_lat,
            "lon": base_lon,
            "alt": base_alt,
            "source": base_source,
            "updated_at": base_updated_at,
            "seq": base_location_seq,
        },
        "map_min_radius_m": MAP_MIN_RADIUS_M,
        "path_min_move_m": PATH_MIN_MOVE_M,
        "online_timeout_s": ONLINE_TIMEOUT_S,
        "total_count": len(arr),
        "active_count": len([x for x in arr if x["online"]]),
        "sos_count": len([x for x in arr if x["sos"] == 1]),
        "alert_count": len(alerts),
        "pending_reply_count": len(pending_commands),
        "climbers": arr,
        "alerts": alerts,
        "messages": messages[-50:],
        "event_log": event_log[-120:],
    })



@app.route("/api/export-log")
def api_export_log():
    lines = ["time,level,source,event,details"]

    for row in event_log:
        vals = [
            str(row.get("time", "")).replace('"', '""'),
            str(row.get("level", "")).replace('"', '""'),
            str(row.get("source", "")).replace('"', '""'),
            str(row.get("event", "")).replace('"', '""'),
            str(row.get("details", "")).replace('"', '""'),
        ]
        lines.append(",".join([f'"{v}"' for v in vals]))

    data = "\\n".join(lines) + "\\n"

    return Response(
        data,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=basecamp_session_log.csv"},
    )


@app.route("/api/clear-log", methods=["POST"])
def api_clear_log():
    event_log.clear()
    add_event("INFO", "BASE CAMP", "Session log cleared", "")
    return jsonify({"status": "cleared"})


@app.route("/api/base-location", methods=["POST"])
def api_base_location():
    global base_lat, base_lon, base_alt, base_source, base_updated_at, base_location_seq

    data = request.get_json(silent=True) or {}

    lat = to_float(data.get("lat"), 0.0)
    lon = to_float(data.get("lon"), 0.0)
    alt = to_float(data.get("alt"), 0.0)
    source = str(data.get("source", "MANUAL"))

    if lat == 0 or lon == 0:
        return jsonify({"error": "invalid_location"}), 400

    base_lat = lat
    base_lon = lon
    base_alt = alt
    base_source = source
    base_updated_at = int(time.time())
    base_location_seq += 1

    for c in climbers.values():
        update_distance(c)

    ok = send_base_location_to_lora()

    add_event("INFO", "BASE CAMP", "Base GPS updated", f"{base_lat:.6f}, {base_lon:.6f}")
    add_chat("BASE CAMP", f"Base GPS set to {base_lat:.6f}, {base_lon:.6f}")

    return jsonify({"status": "sent" if ok else "queued"})


@app.route("/api/send-base", methods=["POST"])
def api_send_base():
    ok = send_base_location_to_lora()
    return jsonify({"status": "sent" if ok else "queued"})


@app.route("/api/send", methods=["POST"])
def api_send():
    data = request.get_json(silent=True) or {}

    target = data.get("target", "CLIMBER01").strip()
    msg = data.get("message", "").strip()

    if not msg:
        return jsonify({"error": "empty"}), 400

    if len(msg) > 120:
        msg = msg[:120]

    msg = msg.replace(",", " ")

    serial_line = f"MSG|{target}|{msg}"
    ok = queue_or_send(serial_line, msg, target)

    if ok:
        get_climber(target)["last_reply"] = msg
        add_event("MESSAGE", "BASE CAMP", f"Message sent to {target}", msg)
        return jsonify({"status": "sent"})

    return jsonify({"status": "queued"})


@app.route("/api/clear-sos", methods=["POST"])
def api_clear_sos():
    data = request.get_json(silent=True) or {}

    target = data.get("target", "CLIMBER01").strip()
    serial_line = f"CLEAR|{target}"

    get_climber(target)["sos"] = 0
    add_event("INFO", "BASE CAMP", f"SOS clear sent to {target}", "")

    ok = queue_or_send(serial_line, "SOS cleared", target)

    return jsonify({"status": "sent" if ok else "queued"})


# ===================== HTML UI =====================
HTML = """
<!DOCTYPE html>
<html>
<head>
<title>Base Camp Monitor</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
body { margin: 0; font-family: Arial, sans-serif; background: #f3f5f7; color: #0f172a; }
header { background: #0f172a; color: white; padding: 20px; }
.wrap { max-width: 1250px; margin: auto; padding: 18px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.card, .panel { background: white; border-radius: 18px; padding: 16px; box-shadow: 0 2px 8px #0001; }
.value { font-size: 28px; font-weight: bold; }
.layout { display: grid; grid-template-columns: 390px 1fr; gap: 16px; margin-top: 16px; }
@media(max-width: 900px) { .layout { grid-template-columns: 1fr; } }
.climber { padding: 12px; border-left: 8px solid #6b7280; background: #f8fafc; border-radius: 14px; margin-bottom: 10px; cursor: pointer; }
.safe { border-left-color: #16a34a; }
.danger { border-left-color: #dc2626; }
.warn { border-left-color: #f97316; }
.nogps { border-left-color: #dc2626; }
.lastknown { border-left-color: #f97316; }
.offline { opacity: 0.72; }
.selected { outline: 3px solid #2563eb; }
.row { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding: 6px 0; gap: 10px; }
#mapCanvas { width: 100%; height: 500px; background: #e0f2fe; border-radius: 16px; border: 1px solid #cbd5e1; }
.packet { background: #111827; color: #e5e7eb; border-radius: 12px; padding: 12px; white-space: pre-wrap; word-break: break-word; font-family: Consolas, monospace; min-height: 100px; }
.chat { height: 230px; overflow-y: auto; background: #f8fafc; border-radius: 12px; padding: 10px; }
.msg { padding: 10px; border-radius: 12px; margin: 8px 0; }
.msg.base { background: #dbeafe; }
.msg.climber { background: #dcfce7; }
input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; margin-top: 10px; box-sizing: border-box; }
button { padding: 12px 16px; border: 0; border-radius: 10px; background: #2563eb; color: white; font-weight: bold; margin-top: 8px; cursor: pointer; }
button.danger { background: #dc2626; }
button.green { background: #16a34a; }
.note { color: #64748b; font-size: 13px; line-height: 1.4; }
.badge { display: inline-block; color: white; padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: bold; }
.badge.ok { background: #16a34a; }
.badge.warn { background: #f97316; }
.badge.bad { background: #dc2626; }
.badge.gray { background: #64748b; }
.alertbox { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; }
.alertitem { border-radius: 12px; padding: 12px; font-weight: bold; }
.alertitem.CRITICAL { background: #fee2e2; color: #991b1b; border-left: 6px solid #dc2626; }
.alertitem.WARNING { background: #ffedd5; color: #9a3412; border-left: 6px solid #f97316; }
.alertitem.INFO { background: #dbeafe; color: #1e3a8a; border-left: 6px solid #2563eb; }
.logbox { max-height: 260px; overflow-y: auto; background: #f8fafc; border-radius: 12px; padding: 10px; margin-top: 10px; }
.logrow { display: grid; grid-template-columns: 80px 90px 140px 1fr; gap: 8px; padding: 7px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
@media(max-width: 700px) { .logrow { grid-template-columns: 1fr; } }
</style>
</head>

<body>
<header>
    <h1>Mountain Climber Base Camp Monitor</h1>
    <div id="serial">Checking...</div>
</header>

<div class="wrap">
    <div class="grid">
        <div class="card"><div>Total</div><div class="value" id="total">0</div></div>
        <div class="card"><div>Active</div><div class="value" id="active">0</div></div>
        <div class="card"><div>SOS</div><div class="value" id="sos">0</div></div>
        <div class="card"><div>Alerts</div><div class="value" id="alertsCount">0</div></div>
        <div class="card"><div>Pending Replies</div><div class="value" id="pending">0</div></div>
    </div>

    <div class="panel" style="margin-top:16px;">
        <h2>Active Alerts</h2>
        <div id="alertsBox" class="alertbox">No active alerts</div>
    </div>

    <div class="layout">
        <div class="panel">
            <h2>Basecamp GPS Setup</h2>
            <p class="note">Default: 7.253061, 80.592154. Enter exact basecamp GPS and send it to the climber by LoRa.</p>
            <div class="row"><span>Source</span><b id="baseSource">DEFAULT</b></div>
            <div class="row"><span>Latitude</span><b id="baseLatText">0</b></div>
            <div class="row"><span>Longitude</span><b id="baseLonText">0</b></div>

            <input id="manualBaseLat" type="number" step="0.000001" placeholder="Latitude e.g. 7.253061">
            <input id="manualBaseLon" type="number" step="0.000001" placeholder="Longitude e.g. 80.592154">

            <button class="green" onclick="setManualBase()">Set Basecamp GPS + Send to Climber</button>
            <button onclick="sendBaseToClimber()">Send Current Base GPS Again</button>
            <p class="note" id="baseInfo"></p>

            <h2>Climbers</h2>
            <div id="list"></div>
        </div>

        <div class="panel">
            <h2>GPS Distance Map</h2>
            <canvas id="mapCanvas"></canvas>
            <p><b>B</b> = Basecamp, <b>C</b> = Climber, orange C = last known location.</p>
            <p>Selected: <b id="selectedText">CLIMBER01</b></p>
        </div>
    </div>

    <div class="layout">
        <div class="panel">
            <h2>Latest Packet</h2>
            <div class="packet" id="packet">No packet</div>
        </div>

        <div class="panel">
            <h2>Conversation</h2>
            <div class="chat" id="chat"></div>
            <input id="msg" placeholder="Reply to selected climber..." maxlength="120">
            <button onclick="sendMsg()">Send Message</button>
            <button class="danger" onclick="clearSos()">Clear SOS</button>
        </div>
    </div>

    <div class="panel" style="margin-top:16px;">
        <h2>Session Log</h2>
        <p class="note">Operational log for SOS, messages, GPS setup, and basecamp actions.</p>
        <button onclick="window.location.href='/api/export-log'">Export Session CSV</button>
        <button class="danger" onclick="clearLog()">Clear Log</button>
        <div class="logbox" id="sessionLog">No log entries</div>
    </div>
</div>

<script>
let selected = "CLIMBER01";
let climbers = [];
let basecamp = { name: "BASE CAMP", lat: 0, lon: 0, alt: 0, source: "DEFAULT", seq: 0 };
let mapMinRadiusM = 250;

function gpsBadge(c) {
    if (c.gps_fix === 1) return '<span class="badge ok">' + c.gps + '</span>';
    if (c.has_last_known === 1) return '<span class="badge warn">NO GPS - LAST KNOWN</span>';
    return '<span class="badge bad">NO GPS FOUND</span>';
}

function onlineBadge(c) {
    if (c.online) return '<span class="badge ok">ONLINE</span>';
    return '<span class="badge gray">OFFLINE</span>';
}

function cls(c) {
    let s = "";
    if (!c.online) s += " offline";
    if (c.sos == 1) return s + " danger";
    if (c.gps_fix !== 1 && c.has_last_known === 1) return s + " lastknown";
    if (c.gps_fix !== 1) return s + " nogps";
    if (c.battery < 20) return s + " warn";
    return s + " safe";
}

function esc(t) {
    let d = document.createElement("div");
    d.innerText = t;
    return d.innerHTML;
}

function formatDistance(m) {
    if (!m || m <= 0) return "0 m";
    if (m < 1000) return m.toFixed(1) + " m";
    return (m / 1000).toFixed(2) + " km";
}

function mapLat(c) {
    return c.gps_fix === 1 ? c.lat : (c.has_last_known === 1 ? c.last_known_lat : 0);
}

function mapLon(c) {
    return c.gps_fix === 1 ? c.lon : (c.has_last_known === 1 ? c.last_known_lon : 0);
}

function selectClimber(id) {
    selected = id;
    document.getElementById("selectedText").innerText = id;
    drawSelected();
    drawList();
    drawMap();
}

function drawSelected() {
    let c = climbers.find(x => x.id == selected) || climbers[0];

    if (!c) return;

    selected = c.id;
    document.getElementById("selectedText").innerText = c.id;
    document.getElementById("packet").innerText = c.last_packet;
}

function drawMap() {
    const canvas = document.getElementById("mapCanvas");
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
        const x = (canvas.width / 4) * i;
        const y = (canvas.height / 4) * i;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    const baseX = canvas.width / 2;
    const baseY = canvas.height / 2;

    const valid = climbers.filter(c => mapLat(c) !== 0 && mapLon(c) !== 0);

    let maxDistance = mapMinRadiusM;

    valid.forEach(c => {
        if (c.distance_m > maxDistance) maxDistance = c.distance_m;
    });

    const metersVisible = Math.max(mapMinRadiusM, maxDistance * 1.4);

    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.arc(baseX, baseY, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Arial";
    ctx.fillText("B", baseX - 5, baseY + 5);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 13px Arial";
    ctx.fillText("BASE", baseX + 24, baseY - 10);
    ctx.font = "11px Arial";
    ctx.fillText(basecamp.lat.toFixed(6) + ", " + basecamp.lon.toFixed(6), baseX + 24, baseY + 8);

    ctx.fillStyle = "#475569";
    ctx.font = "12px Arial";
    ctx.fillText("GPS distance sketch - jitter filtered", 15, 20);
    ctx.fillText("green = current GPS, orange = last known, blue = filtered path", 15, 38);
    ctx.fillText("Radius: ±" + metersVisible.toFixed(0) + " m", 15, 56);

    if (valid.length === 0) {
        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 16px Arial";
        ctx.fillText("NO GPS FOUND - waiting for first climber location", 30, 90);
        return;
    }

    valid.forEach(c => {
        function point(lat, lon) {
            const dx = (lon - basecamp.lon) * 111320 * Math.cos(basecamp.lat * Math.PI / 180);
            const dy = (lat - basecamp.lat) * 110540;

            let px = baseX + (dx / metersVisible) * (canvas.width / 2);
            let py = baseY - (dy / metersVisible) * (canvas.height / 2);

            px = Math.max(24, Math.min(canvas.width - 24, px));
            py = Math.max(24, Math.min(canvas.height - 24, py));

            return {x: px, y: py};
        }

        if (c.path && c.path.length > 1) {
            ctx.strokeStyle = "#2563eb";
            ctx.lineWidth = 3;
            ctx.beginPath();

            let p0 = point(c.path[0].lat, c.path[0].lon);
            ctx.moveTo(p0.x, p0.y);

            c.path.slice(1).forEach(pt => {
                let p = point(pt.lat, pt.lon);
                ctx.lineTo(p.x, p.y);
            });

            ctx.stroke();
        }

        const p = point(mapLat(c), mapLon(c));

        ctx.strokeStyle = c.sos === 1 ? "#dc2626" : (c.gps_fix === 1 ? "#334155" : "#f97316");
        ctx.lineWidth = c.id === selected ? 4 : 3;

        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 14px Arial";
        ctx.fillText(formatDistance(c.distance_m), (baseX + p.x) / 2 + 8, (baseY + p.y) / 2 - 10);

        ctx.fillStyle = c.sos === 1 ? "#dc2626" : (c.gps_fix === 1 ? "#16a34a" : "#f97316");
        ctx.beginPath();
        ctx.arc(p.x, p.y, c.id === selected ? 17 : 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px Arial";
        ctx.fillText("C", p.x - 5, p.y + 5);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 13px Arial";
        ctx.fillText(c.id, p.x + 24, p.y - 10);

        ctx.font = "12px Arial";
        ctx.fillText(formatDistance(c.distance_m) + " " + c.direction, p.x + 24, p.y + 9);
        ctx.fillText(c.gps_fix === 1 ? c.gps : "Last known", p.x + 24, p.y + 26);
    });
}

function drawList() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    climbers.forEach(c => {
        const div = document.createElement("div");
        div.className = "climber " + cls(c) + (c.id == selected ? " selected" : "");
        div.onclick = () => selectClimber(c.id);

        const displayLat = mapLat(c);
        const displayLon = mapLon(c);

        div.innerHTML = `
            <h3>${c.id} ${onlineBadge(c)}</h3>
            <div class="row"><span>GPS Status</span><b>${gpsBadge(c)}</b></div>
            <div class="row"><span>GPS Age</span><b>${c.gps_age_s}s</b></div>
            <div class="row"><span>Satellites</span><b>${c.gps_satellites}</b></div>
            <div class="row"><span>HDOP</span><b>${Number(c.gps_hdop).toFixed(1)}</b></div>
            <div class="row"><span>GPS Filter</span><b>${esc(c.gps_reject || "")}</b></div>
            <div class="row"><span>Distance</span><b>${formatDistance(c.distance_m)}</b></div>
            <div class="row"><span>From Base</span><b>${c.direction} (${c.bearing_deg.toFixed(0)}°)</b></div>
            <div class="row"><span>Display Lat</span><b>${displayLat.toFixed(6)}</b></div>
            <div class="row"><span>Display Lon</span><b>${displayLon.toFixed(6)}</b></div>
            <div class="row"><span>Last Known Age</span><b>${c.last_known_age_s}s</b></div>
            <div class="row"><span>Main Battery</span><b>${c.battery}%</b></div>
            <div class="row"><span>Armband Battery</span><b>${c.armband_battery}%</b></div>
            <div class="row"><span>BPM</span><b>${c.bpm}</b></div>
            <div class="row"><span>Armband</span><b>${c.ble ? "OK" : "Disconnected"}</b></div>
            <div class="row"><span>Heart Sensor</span><b>${c.sen ? "OK" : "Missing"}</b></div>
            <div class="row"><span>RSSI</span><b>${c.rssi}</b></div>
            <div class="row"><span>SNR</span><b>${c.snr}</b></div>
            <div class="row"><span>Last Packet</span><b>${c.seconds_since}s ago</b></div>
            <div class="row"><span>Message</span><b>${esc(c.last_message)}</b></div>
        `;

        list.appendChild(div);
    });
}

function drawAlerts(alerts) {
    const box = document.getElementById("alertsBox");
    box.innerHTML = "";

    if (!alerts || alerts.length === 0) {
        box.innerHTML = '<div class="note">No active alerts</div>';
        return;
    }

    alerts.forEach(a => {
        const div = document.createElement("div");
        div.className = "alertitem " + (a.level || "INFO");
        div.innerHTML = `<div>${esc(a.id || "SYSTEM")} • ${esc(a.text || "")}</div>
                         <div style="font-weight:normal;font-size:13px;margin-top:4px;">${esc(a.details || "")}</div>`;
        box.appendChild(div);
    });
}

function drawSessionLog(log) {
    const box = document.getElementById("sessionLog");
    box.innerHTML = "";

    if (!log || log.length === 0) {
        box.innerHTML = '<div class="note">No log entries</div>';
        return;
    }

    log.slice().reverse().forEach(e => {
        const div = document.createElement("div");
        div.className = "logrow";
        div.innerHTML = `<b>${esc(e.time || "")}</b>
                         <span>${esc(e.level || "")}</span>
                         <span>${esc(e.source || "")}</span>
                         <span>${esc(e.event || "")} ${e.details ? " - " + esc(e.details) : ""}</span>`;
        box.appendChild(div);
    });
}

async function update() {
    try {
        const r = await fetch("/api/status", {cache: "no-store"});
        const d = await r.json();

        climbers = d.climbers;
        basecamp = d.basecamp;
        mapMinRadiusM = d.map_min_radius_m || 250;

        document.getElementById("serial").innerText = d.serial_status;
        document.getElementById("total").innerText = d.total_count;
        document.getElementById("active").innerText = d.active_count;
        document.getElementById("sos").innerText = d.sos_count;
        document.getElementById("alertsCount").innerText = d.alert_count || 0;
        document.getElementById("pending").innerText = d.pending_reply_count;

        document.getElementById("baseSource").innerText = basecamp.source || "DEFAULT";
        document.getElementById("baseLatText").innerText = basecamp.lat.toFixed(6);
        document.getElementById("baseLonText").innerText = basecamp.lon.toFixed(6);

        if (!document.getElementById("manualBaseLat").value) {
            document.getElementById("manualBaseLat").value = basecamp.lat.toFixed(6);
        }

        if (!document.getElementById("manualBaseLon").value) {
            document.getElementById("manualBaseLon").value = basecamp.lon.toFixed(6);
        }

        document.getElementById("baseInfo").innerText =
            "Basecamp GPS: " + basecamp.lat.toFixed(6) + ", " + basecamp.lon.toFixed(6) +
            " | Source: " + (basecamp.source || "DEFAULT") +
            " | Seq: " + (basecamp.seq || 0);

        drawList();
        drawMap();
        drawSelected();
        drawAlerts(d.alerts || []);
        drawSessionLog(d.event_log || []);

        const chat = document.getElementById("chat");
        chat.innerHTML = "";

        d.messages.forEach(m => {
            const div = document.createElement("div");
            div.className = "msg " + (m.sender == "BASE CAMP" ? "base" : "climber");
            div.innerHTML = `<b>${m.sender} • ${m.time}</b><br>${esc(m.text)}`;
            chat.appendChild(div);
        });

        chat.scrollTop = chat.scrollHeight;

    } catch (e) {
        document.getElementById("serial").innerText = "Dashboard refresh error";
    }
}

async function setManualBase() {
    const lat = parseFloat(document.getElementById("manualBaseLat").value);
    const lon = parseFloat(document.getElementById("manualBaseLon").value);

    if (!lat || !lon) {
        alert("Enter valid latitude and longitude.");
        return;
    }

    await fetch("/api/base-location", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({lat: lat, lon: lon, alt: 0, source: "MANUAL"})
    });

    update();
}

async function sendBaseToClimber() {
    await fetch("/api/send-base", {method: "POST"});
    update();
}

async function sendMsg() {
    const input = document.getElementById("msg");
    const msg = input.value.trim();

    if (!msg) return;

    await fetch("/api/send", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({target: selected, message: msg})
    });

    input.value = "";
    update();
}

async function clearSos() {
    await fetch("/api/clear-sos", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({target: selected})
    });

    update();
}

async function clearLog() {
    await fetch("/api/clear-log", {method: "POST"});
    update();
}

window.addEventListener("resize", drawMap);
setInterval(update, 750);
update();
</script>
</body>
</html>
"""


if __name__ == "__main__":
    print("Starting Base Camp Dashboard...")
    print("Open: http://127.0.0.1:5000")
    print("Using serial port:", SERIAL_PORT)
    print("Basecamp GPS:", base_lat, base_lon)
    print("Close Arduino Serial Monitor before running this.")

    threading.Thread(target=connect_serial_loop, daemon=True).start()
    threading.Thread(target=serial_reader_loop, daemon=True).start()
    threading.Thread(target=retry_pending_loop, daemon=True).start()

    app.run(host="127.0.0.1", port=5000, debug=False, threaded=True)
