---
layout: home
permalink: index.html

# Updated variables
repository-name: e21-3yp-Mountain-Climber-Health-and-GPS-Tracker
title: Mountain Climber IoT Safety Tracking System
---

# Mountain Climber IoT Safety Tracking System

<p align="center">
  <strong>An off-grid IoT-based safety tracking and health monitoring system for mountain climbers and basecamp rescue teams.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange" alt="Project Status">
  <img src="https://img.shields.io/badge/Platform-IoT-blue" alt="IoT Platform">
  <img src="https://img.shields.io/badge/Communication-LoRa-green" alt="LoRa Communication">
  <img src="https://img.shields.io/badge/Tracking-GPS-red" alt="GPS Tracking">
  <img src="https://img.shields.io/badge/Web%20Dashboard-Flask-lightgrey" alt="Flask Dashboard">
  <img src="https://img.shields.io/badge/Mobile%20Application-Flutter-blueviolet" alt="Flutter Mobile Application">
</p>

---

## Table of Contents

1. [Overview](#overview)
2. [Project Objectives](#project-objectives)
3. [System Architecture](#system-architecture)
4. [Key Features](#key-features)
5. [Hardware Components](#hardware-components)
6. [Software Stack](#software-stack)
7. [Communication Flow](#communication-flow)
8. [Web Dashboard](#web-dashboard)
9. [Mobile Application](#mobile-application)
10. [Getting Started](#getting-started)
11. [Team](#team)
12. [Links](#links)
13. [Future Improvements](#future-improvements)

---

## Overview

The **Mountain Climber IoT Safety Tracking System** is an embedded and IoT-based project developed to improve climber safety in remote mountain environments. The system focuses on real-time location tracking, emergency communication, and basic health monitoring support for climbers and basecamp operators.

Mountain climbers and hikers often travel through areas where cellular network coverage is weak, unstable, or unavailable. In such situations, traditional mobile-based communication methods may not be reliable during emergencies. This project addresses that limitation by using **LoRa communication** as the primary long-range, low-power communication method between the climber device and the basecamp station.

The system includes a portable climber device, a basecamp LoRa receiver node, a web-based monitoring dashboard, a Flutter mobile application, and a wearable armband planned for health monitoring. The climber device can collect GPS coordinates, transmit status updates to the basecamp, send SOS alerts, exchange short messages, and display essential information through an OLED display.

---

## Project Objectives

The main objectives of this project are:

* To design and implement an off-grid climber tracking system using LoRa communication.
* To monitor climber location using GPS and display relevant information at the basecamp.
* To provide emergency alert functionality through a hardware SOS button.
* To support two-way short message communication between climber and basecamp.
* To provide a web dashboard for basecamp operators to monitor climber status.
* To develop a mobile application for climber-side monitoring and interaction.
* To support future health monitoring through a wearable Bluetooth armband.

---

## System Architecture

The proposed system consists of four main modules:

| Module              | Description                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Main Climber Device | ESP32-based portable device responsible for GPS tracking, LoRa communication, OLED display output, button input, and mobile app connectivity. |
| Wearable Armband    | ESP32-H2 based wearable unit planned for heart rate monitoring using a MAX30102 sensor and Bluetooth communication.                           |
| Basecamp LoRa Node  | ESP32-based LoRa receiver/transmitter connected to the basecamp laptop through USB serial communication.                                      |
| Web Dashboard       | Flask-based dashboard used by basecamp operators to monitor climber location, status, alerts, messages, and logs.                             |
| Mobile Application  | Flutter-based companion application used by the climber for status viewing, messages, SOS control, and phone GPS fallback.                    |

### High-Level System Diagram

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

## Key Features

| Feature                            | Description                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| GPS Location Tracking              | Tracks climber location using a NEO-6M GPS module.                                                      |
| LoRa Communication                 | Enables long-range data transmission between climber and basecamp without relying on cellular networks. |
| SOS Emergency Alert                | Allows the climber to send an emergency alert using a physical SOS button.                              |
| Check-in Function                  | Allows the climber to quickly send an "I am OK" message to the basecamp.                                |
| Distance and Direction Calculation | Calculates the distance and direction between the climber and the basecamp reference point.             |
| Web Dashboard Monitoring           | Displays climber status, GPS information, alerts, messages, and session logs.                           |
| Mobile Application Support         | Provides a companion interface for the climber to view status and send messages.                        |
| Phone GPS Fallback                 | Allows the mobile phone GPS to be used when the NEO-6M GPS module has no valid fix.                     |
| Two-Way Messaging                  | Supports short messages between the basecamp and climber.                                               |
| Health Monitoring Support          | Supports future integration with a wearable armband for heart rate monitoring.                          |
| Battery Monitoring Support         | Designed to support battery percentage display for both climber device and armband.                     |
| Multi-Climber Support              | Dashboard structure supports multiple climber devices using unique climber IDs.                         |
| Session Log and Export             | Maintains a session log that can be exported for review and documentation.                              |

---

## Hardware Components

### Main Climber Device

| Component                   | Purpose                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| ESP32 Development Board     | Main controller for GPS, LoRa, WiFi access point, OLED display, and button inputs.         |
| SX1278 / Ra-02 LoRa Module  | Provides long-range wireless communication with the basecamp node.                         |
| NEO-6M GPS Module           | Provides latitude, longitude, and altitude information.                                    |
| OLED Display                | Displays GPS status, distance, LoRa status, armband status, SOS status, and battery level. |
| Push Buttons                | Provides physical SOS, Clear SOS, and Check-in controls.                                   |
| Rechargeable Battery System | Powers the portable climber device during field operation.                                 |

### Wearable Armband

| Component                  | Purpose                                                          |
| -------------------------- | ---------------------------------------------------------------- |
| ESP32-H2 Development Board | Controller for the wearable armband and Bluetooth communication. |
| MAX30102 Sensor            | Planned sensor for heart rate and pulse monitoring.              |
| Rechargeable LiPo Battery  | Provides portable power for the armband.                         |
| Power Switch               | Allows the armband to be turned on and off.                      |

### Basecamp Node

| Component                  | Purpose                                                     |
| -------------------------- | ----------------------------------------------------------- |
| ESP32 Development Board    | Acts as the basecamp LoRa bridge.                           |
| SX1278 / Ra-02 LoRa Module | Receives climber telemetry and transmits basecamp messages. |
| USB Serial Connection      | Connects the basecamp ESP32 to the laptop dashboard.        |
| Laptop or PC               | Runs the Flask web dashboard.                               |

---

## Software Stack

| Area                  | Technologies / Tools                         |
| --------------------- | -------------------------------------------- |
| Main Device Firmware  | Arduino C/C++ for ESP32                      |
| Basecamp Firmware     | Arduino C/C++ for ESP32 LoRa bridge          |
| Armband Firmware      | Arduino C/C++ for ESP32-H2                   |
| Web Dashboard         | Python Flask                                 |
| Mobile Application    | Flutter                                      |
| Dashboard Frontend    | HTML, CSS, JavaScript                        |
| Communication Methods | LoRa, WiFi AP, Bluetooth, USB Serial         |
| GPS Processing        | NEO-6M GPS data parsing and filtering        |
| Version Control       | Git and GitHub                               |
| Documentation         | GitHub Pages with Jekyll-compatible Markdown |

---

## Communication Flow

### Normal Tracking Mode

```text
NEO-6M GPS Module
        |
        v
Main Climber ESP32
        |
        | LoRa telemetry packet
        v
Basecamp ESP32
        |
        | USB Serial
        v
Flask Web Dashboard
```

### SOS Emergency Mode

```text
SOS Button Pressed
        |
        v
Main Climber ESP32
        |
        | LoRa SOS packet
        v
Basecamp ESP32
        |
        v
Web Dashboard Alert Panel
```

### Mobile GPS Fallback

```text
Phone GPS
        |
        | WiFi AP
        v
Main Climber ESP32
        |
        | LoRa telemetry packet
        v
Basecamp Dashboard
```

### Armband Health Data Flow

```text
MAX30102 Sensor
        |
        v
ESP32-H2 Armband
        |
        | Bluetooth
        v
Main Climber Device / Mobile Application
        |
        v
Dashboard and Mobile Interface
```

---

## Web Dashboard

The web dashboard is intended for basecamp operators or mountain rangers. It provides a centralized monitoring interface for climber tracking and emergency response.

| Function                 | Description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| Multi-Climber Monitoring | Displays climber cards for each unique climber device ID.                                   |
| GPS Status Display       | Shows whether location data is from NEO-6M, phone GPS, last known location, or unavailable. |
| Distance Map             | Displays basecamp point, climber point, direction, distance, and movement path.             |
| Alert Panel              | Highlights SOS, GPS lost, offline climber, and low battery conditions.                      |
| Conversation Panel       | Supports short message communication between basecamp and climber.                          |
| Session Log              | Records SOS events, messages, GPS updates, and basecamp actions.                            |
| Export Function          | Allows session log export for documentation and review.                                     |
| Basecamp GPS Setup       | Allows operators to manually enter and send basecamp GPS coordinates.                       |

---

## Mobile Application

The Flutter mobile application acts as a companion interface for the climber. It communicates with the main climber device through the ESP32 WiFi access point.

| Function             | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| Device Status View   | Displays GPS, LoRa, armband, SOS, and battery status.                           |
| Distance Information | Shows distance and direction from the basecamp.                                 |
| SOS Control          | Allows the climber to trigger an SOS alert from the mobile app.                 |
| Quick Messages       | Provides predefined messages such as "I am OK", "Need help", and "Low battery". |
| Phone GPS Fallback   | Sends phone GPS data to the climber device when NEO-6M GPS is unavailable.      |
| Armband Status       | Displays Bluetooth armband and heart sensor status.                             |
| Conversation View    | Shows messages exchanged between the climber and the basecamp.                  |

---

## Getting Started

This repository contains firmware, dashboard code, mobile application code, and documentation related to the Mountain Climber IoT Safety Tracking System.

### Repository

[View Project Repository](https://github.com/cepdnaclk/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker){:target="_blank"}

### Project Page

[Open Project Page](https://cepdnaclk.github.io/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker){:target="_blank"}

### Suggested Repository Documentation

| Section                | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| Project Overview       | Problem definition, motivation, and proposed solution.                       |
| Hardware Design        | Component selection, wiring, device structure, and enclosure design.         |
| Firmware               | ESP32 firmware for the climber device, basecamp node, and armband.           |
| Web Dashboard          | Flask dashboard setup, interface, and monitoring features.                   |
| Mobile Application     | Flutter application setup and usage instructions.                            |
| Communication Protocol | LoRa packet formats, message flow, and status codes.                         |
| Testing and Results    | GPS testing, LoRa communication testing, dashboard testing, and SOS testing. |
| Future Improvements    | Planned improvements and possible extensions.                                |

---

## Team

| Registration No. | Name               | Email                                               |
| ---------------- | ------------------ | --------------------------------------------------- |
| e21198           | Sahan Jayasundara  | [e21198@eng.pdn.ac.lk](mailto:e21198@eng.pdn.ac.lk) |
| e21328           | Prabash Rathnayaka | [e21328@eng.pdn.ac.lk](mailto:e21328@eng.pdn.ac.lk) |
| e21353           | Pasan Sandeep      | [e21353@eng.pdn.ac.lk](mailto:e21353@eng.pdn.ac.lk) |

---

## Links

| Resource                           | Link                                                                                                                 |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| GitHub Repository                  | [Project Repository](https://github.com/cepdnaclk/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker){:target="_blank"} |
| GitHub Pages Site                  | [Project Page](https://cepdnaclk.github.io/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker){:target="_blank"}        |
| Department of Computer Engineering | [Department Website](http://www.ce.pdn.ac.lk/){:target="_blank"}                                                     |
| University of Peradeniya           | [Faculty of Engineering](https://eng.pdn.ac.lk/){:target="_blank"}                                                   |

---

## Academic Context

This project is developed as part of the undergraduate engineering project work at the **Department of Computer Engineering, Faculty of Engineering, University of Peradeniya**.

The objective of the project is to design and implement a practical off-grid IoT safety system that can improve climber tracking, emergency communication, and rescue coordination in remote mountain environments.

---

## Future Improvements

Planned improvements include:

* Improved battery monitoring and charging system.
* Compact and weather-resistant enclosure design.
* Extended LoRa range testing with improved antennas.
* Larger multi-climber deployment.
* More accurate heart rate monitoring using the MAX30102 sensor.
* Optional online map support when internet is available at basecamp.
* Improved session reporting and rescue event export.
* Solar-powered LoRa repeater support for extended range.

---

<p align="center">
  <strong>Mountain Climber IoT Safety Tracking System</strong><br>
  Department of Computer Engineering<br>
  Faculty of Engineering, University of Peradeniya
</p>