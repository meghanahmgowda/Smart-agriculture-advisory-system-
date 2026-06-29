/*
  Smart Agri - ESP32 Sensor Node
  --------------------------------
  This sketch runs a simple web server on an ESP32 and exposes sensor readings
  as JSON at: http://<esp32-ip>/sensors

  Hardware:
  - ESP32 DevKit
  - DHT22 or DHT11 for air temperature/humidity
  - Capacitive soil moisture sensor (analog)
  - DS18B20 or NTC for soil temperature
  - pH sensor (analog)
  - NPK sensor (Modbus/RS485) or analog proxy
  - Battery voltage divider for battery %

  Required libraries:
  - WiFi (built-in)
  - WebServer (built-in)
  - ArduinoJson
  - DHT sensor library (optional)
*/

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// ----- Wi-Fi credentials -----
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);

// Pin definitions
const int SOIL_MOISTURE_PIN = 34;
const int SOIL_TEMP_PIN = 35;      // analog proxy or DS18B20 data
const int PH_PIN = 32;
const int NPK_PIN = 33;            // analog proxy
const int BATTERY_PIN = 39;        // voltage divider

float readSoilMoisture() {
  int raw = analogRead(SOIL_MOISTURE_PIN);
  // Map raw 0-4095 to 0-100% (calibrate for your sensor)
  return constrain(map(raw, 0, 4095, 100, 0), 0, 100);
}

float readSoilTemperature() {
  int raw = analogRead(SOIL_TEMP_PIN);
  // Example conversion - replace with DS18B20 or calibrated NTC
  return 20.0 + (raw / 4095.0) * 20.0;
}

float readPH() {
  int raw = analogRead(PH_PIN);
  // Calibrate: pH 0-14 mapped from voltage range
  return 7.0 + ((raw - 2048) / 4095.0) * 14.0;
}

float readNPK() {
  int raw = analogRead(NPK_PIN);
  return raw / 20.0; // ppm proxy
}

float readBattery() {
  int raw = analogRead(BATTERY_PIN);
  // Example for 3.7V Li-ion through 100k/100k divider
  float voltage = (raw / 4095.0) * 3.3 * 2.0;
  // Map 3.0V (0%) to 4.2V (100%)
  return constrain((voltage - 3.0) / (4.2 - 3.0) * 100, 0, 100);
}

void handleSensors() {
  StaticJsonDocument<512> doc;
  doc["soilMoisture"] = readSoilMoisture();
  doc["soilTemperature"] = readSoilTemperature();
  doc["airHumidity"] = 55.0;        // replace with DHT22 reading
  doc["soilPh"] = readPH();
  doc["npk"] = readNPK();
  doc["battery"] = readBattery();

  String response;
  serializeJson(doc, response);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", response);
}

void handleRoot() {
  server.send(200, "text/plain", "Smart Agri ESP32 Sensor Node");
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/sensors", handleSensors);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}
