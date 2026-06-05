# Mountain Climber IoT Safety Tracking System

<p align="center">
  <strong>An off-grid IoT-based safety tracking and emergency communication system for mountain climbers and basecamp rescue teams.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange" alt="Project Status">
  <img src="https://img.shields.io/badge/Platform-IoT-blue" alt="IoT Platform">
  <img src="https://img.shields.io/badge/Communication-LoRa-green" alt="LoRa Communication">
  <img src="https://img.shields.io/badge/Tracking-GPS-red" alt="GPS Tracking">
  <img src="https://img.shields.io/badge/Web%20Dashboard-Flask-lightgrey" alt="Flask Dashboard">
  <img src="https://img.shields.io/badge/Mobile%20App-Flutter-blueviolet" alt="Flutter Mobile App">
</p>

---

## Overview

The **Mountain Climber IoT Safety Tracking System** is a third-year engineering project developed to improve climber safety in remote mountain environments where cellular network coverage may be weak, unstable, or unavailable.

The system uses **LoRa communication** as the primary off-grid communication method between the climber device and the basecamp station. It supports GPS-based location tracking, SOS emergency alerts, two-way short messaging, distance and direction calculation, and basecamp monitoring through a web dashboard.

A Flutter mobile application is also included as a companion interface for the climber. The system further supports future health monitoring through a Bluetooth-enabled wearable armband.

---

## Main Features

| Feature                | Description                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| GPS Tracking           | Tracks climber location using a NEO-6M GPS module.                                |
| LoRa Communication     | Enables long-range off-grid communication between climber and basecamp.           |
| SOS Alert              | Allows the climber to send emergency alerts using a physical SOS button.          |
| Check-in Button        | Sends quick "I am OK" messages to basecamp.                                       |
| Two-Way Messaging      | Supports short text messages between climber and basecamp.                        |
| Distance and Direction | Calculates distance and direction from basecamp to climber.                       |
| Web Dashboard          | Displays climber status, location, alerts, messages, and session logs.            |
| Mobile App             | Provides climber-side status view, messages, SOS control, and phone GPS fallback. |
| Armband Support        | Supports future heart rate monitoring through a Bluetooth armband.                |
| Multi-Climber Support  | Dashboard is designed to support multiple climber devices.                        |

---

## System Architecture

```text
Wearable Armband
ESP32-H2 + MAX30102
        |
        | Bluetooth
        v
Main Climber Device
ESP32 + NEO-6M GPS + LoRa + OLED + Buttons
        |
        | LoRa
        v
Basecamp ESP32 LoRa Node
        |
        | USB Serial
        v
Laptop Web Dashboard
```

---

## Hardware Components

### Main Climber Device

| Component                  | Purpose                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| ESP32 Development Board    | Main controller for GPS, LoRa, WiFi AP, OLED display, and buttons.          |
| SX1278 / Ra-02 LoRa Module | Long-range communication with basecamp.                                     |
| NEO-6M GPS Module          | Provides GPS coordinates.                                                   |
| OLED Display               | Displays GPS status, distance, LoRa status, armband status, and SOS status. |
| Push Buttons               | SOS, Clear SOS, and Check-in controls.                                      |
| Battery System             | Portable rechargeable power source.                                         |

### Basecamp Node

| Component                  | Purpose                                                  |
| -------------------------- | -------------------------------------------------------- |
| ESP32 Development Board    | LoRa bridge between climber device and laptop dashboard. |
| SX1278 / Ra-02 LoRa Module | Receives climber telemetry and sends basecamp messages.  |
| USB Serial Connection      | Connects the basecamp node to the laptop.                |
| Laptop / PC                | Runs the web dashboard.                                  |

### Wearable Armband

| Component       | Purpose                                |
| --------------- | -------------------------------------- |
| ESP32-H2 Board  | Bluetooth-enabled wearable controller. |
| MAX30102 Sensor | Planned heart rate monitoring sensor.  |
| LiPo Battery    | Portable armband power source.         |

---

## Software Stack

| Area                 | Technology                           |
| -------------------- | ------------------------------------ |
| Main Device Firmware | Arduino C/C++ for ESP32              |
| Basecamp Firmware    | Arduino C/C++ for ESP32              |
| Armband Firmware     | Arduino C/C++ for ESP32-H2           |
| Web Dashboard        | Python Flask                         |
| Mobile Application   | Flutter                              |
| Communication        | LoRa, WiFi AP, Bluetooth, USB Serial |
| Version Control      | Git and GitHub                       |
| Documentation        | Markdown and GitHub Pages            |

---

## Repository Structure

```text
.
├── docs/
│   └── README.md
│
├── firmware/
│   ├── climber-main/
│   ├── basecamp-node/
│   └── armband/
│
├── web-dashboard/
│   ├── app.py
│   └── requirements.txt
│
├── mobile-app/
│   └── climber_app/
│
├── hardware/
│   ├── component-list.md
│   └── wiring-diagrams/
│
├── reports/
│
├── stable-backups/
│
└── README.md
```

---

## Communication Flow

### Normal Tracking

```text
NEO-6M GPS
    ↓
Main Climber ESP32
    ↓ LoRa telemetry
Basecamp ESP32
    ↓ USB Serial
Flask Web Dashboard
```

### SOS Emergency Alert

```text
SOS Button Pressed
    ↓
Main Climber ESP32
    ↓ LoRa SOS packet
Basecamp ESP32
    ↓
Web Dashboard Alert Panel
```

### Phone GPS Fallback

```text
Phone GPS
    ↓ WiFi AP
Main Climber ESP32
    ↓ LoRa
Basecamp Dashboard
```

---

## Team Members

| Registration No. | Name               | Email                                               |
| ---------------- | ------------------ | --------------------------------------------------- |
| e21198           | Sahan Jayasundara  | [e21198@eng.pdn.ac.lk](mailto:e21198@eng.pdn.ac.lk) |
| e21328           | Prabash Rathnayaka | [e21328@eng.pdn.ac.lk](mailto:e21328@eng.pdn.ac.lk) |
| e21353           | Pasan Sandeep      | [e21353@eng.pdn.ac.lk](mailto:e21353@eng.pdn.ac.lk) |

---

## Project Links

| Resource          | Link                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| GitHub Repository | [Repository](https://github.com/cepdnaclk/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker)        |
| Project Page      | [GitHub Pages Site](https://cepdnaclk.github.io/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker/) |
| Department        | [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)                                    |
| University        | [Faculty of Engineering, University of Peradeniya](https://eng.pdn.ac.lk/)                        |

---

## Current Development Status

The current implementation includes:

* ESP32-based main climber device firmware
* ESP32-based basecamp LoRa bridge firmware
* ESP32-H2 armband firmware
* Flask-based basecamp web dashboard
* Flutter mobile application
* LoRa-based climber-to-basecamp communication
* SOS alerting and two-way messaging
* GPS tracking with phone GPS fallback
* Session log and alert panel support

---

## Future Improvements

Planned improvements include:

* Improved battery monitoring and charging system
* Compact and weather-resistant enclosure design
* Extended LoRa range testing with improved antennas
* More accurate heart rate monitoring with MAX30102
* Larger multi-climber deployment
* Optional online map support when internet is available
* Solar-powered LoRa repeater support
* Improved rescue report generation and session export

---

## Academic Context

This project is developed as part of the undergraduate third-year project work at the **Department of Computer Engineering, Faculty of Engineering, University of Peradeniya**.

The objective of the project is to design and implement a practical off-grid IoT safety solution for climber tracking, emergency communication, and basecamp rescue coordination.

---

<p align="center">
  <strong>Mountain Climber IoT Safety Tracking System</strong><br>
  Department of Computer Engineering<br>
  Faculty of Engineering, University of Peradeniya
</p>