#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEAdvertising.h>

#define BLE_DEVICE_NAME "CLIMBER_ARMBAND"

BLEAdvertising* advertising;

unsigned long lastAdvMs = 0;
const unsigned long ADV_INTERVAL = 700;

void advertiseData() {
  // Heart sensor is currently missing.
  // ARM:1 = armband alive, BPM:0 = no reading, SEN:0 = sensor missing
  String payload = "ARM:1,BPM:0,SEN:0,BAT:90";

  String mfgData = "";
  mfgData += (char)0xFF;
  mfgData += (char)0xFF;
  mfgData += payload;

  advertising->stop();

  BLEAdvertisementData advData;
  advData.setName(BLE_DEVICE_NAME);
  advData.setManufacturerData(mfgData);

  advertising->setAdvertisementData(advData);
  advertising->start();
}

void setup() {
  BLEDevice::init(BLE_DEVICE_NAME);
  BLEDevice::createServer();

  advertising = BLEDevice::getAdvertising();
  advertiseData();
}

void loop() {
  if (millis() - lastAdvMs >= ADV_INTERVAL) {
    lastAdvMs = millis();
    advertiseData();
  }

  delay(80);
}
