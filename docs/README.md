---
layout: home
permalink: index.html

# Updated variables
repository-name: e21-3yp-Mountain-Climber-Health-and-GPS-Tracker
title: Mountain Climber Health and GPS Tracker
---

# 🏔️ Mountain Climber Health and GPS Tracker

<p align="center">
  <strong>An IoT-based real-time safety monitoring and emergency alert system for mountaineers</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge" alt="Project Status">
  <img src="https://img.shields.io/badge/Platform-IoT-blue?style=for-the-badge" alt="IoT Platform">
  <img src="https://img.shields.io/badge/Connectivity-WiFi%20%7C%20GSM-green?style=for-the-badge" alt="Connectivity">
  <img src="https://img.shields.io/badge/Tracking-GPS%20%26%20Health-red?style=for-the-badge" alt="GPS Tracking">
  <img src="https://img.shields.io/badge/University-Peradeniya-purple?style=for-the-badge" alt="University of Peradeniya">
</p>

---

## 📑 Quick Navigation

| [Overview](#-overview) | [Architecture](#-system-architecture) | [Features](#-key-features) | [Hardware](#-hardware-components) | [Software](#-software-stack) | [Team](#-team) |
|:---:|:---:|:---:|:---:|:---:|:---:|

---

## 🎯 Project Vision

Mountain climbing and hiking represent some of humanity's most adventurous pursuits, but they also carry inherent risks. Remote mountain environments often have **poor communication coverage**, making it difficult for rescue teams to respond quickly to emergencies.

This project addresses a critical gap in mountaineer safety by creating an **intelligent wearable IoT device** that continuously monitors climber health and location, enabling:
- ✅ **Real-time health monitoring** of vital signs
- ✅ **Accurate GPS location tracking** in remote areas
- ✅ **Automated emergency alerts** via SMS with coordinates
- ✅ **Live dashboard tracking** for basecamp or rescue teams

---

## 🔍 Overview

The **Mountain Climber Health and GPS Tracker** is an IoT-based safety system designed to support mountaineers, hikers, and rescue teams by providing real-time health and location monitoring.

### Problem Statement

When climbers move through remote mountain areas:
- 📡 Communication is unreliable or unavailable
- ⏱️ Emergency response times are critical
- 🗺️ Rescue teams struggle to locate distressed climbers
- ❤️ Health deterioration may go unnoticed

### Solution

Our system solves these challenges by:
1. **Collecting** real-time health data (heart rate, temperature)
2. **Tracking** precise GPS location coordinates
3. **Transmitting** data via WiFi (dashboard) and GSM (emergency alerts)
4. **Alerting** rescue teams with location during critical events

---

## 🧭 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIMBER DEVICE                       │
├─────────────────────────────────────────────────────────┤
│  ❤️ Heart Rate Sensor  │  🌡️ Temperature Sensor         │
│  📍 GPS Module         │  💾 Atmega328 Microcontroller  │
└──────────┬──────────────────────────────┬───────────────┘
           │                              │
     ┌─────▼─────┐                  ┌─────▼──────┐
     │   WiFi    │                  │    GSM     │
     │ Connection│                  │  Module    │
     └─────┬─────┘                  └─────┬──────┘
           │                              │
     ┌─────▼──────────────────────────────▼─────┐
     │  DATA TRANSMISSION & COMMUNICATION LAYER  │
     └─────┬──────────────────────────────┬─────┘
           │                              │
    ┌──────▼──────┐            ┌─────────▼────────┐
    │   Web       │            │  Emergency SMS   │
    │  Dashboard  │            │  Alert System    │
    └─────┬──────��             └─────────┬────────┘
          │                              │
    ┌─────▼──────────────────────────────▼─────┐
    │   MONITORING, ALERTING & RESCUE TEAM      │
    │   Real-time Location & Health Status      │
    └──────────────────────────────────────────┘
```

### System Components

| Component | Role | Purpose |
|-----------|------|---------|
| **Wearable Device** | 🧑‍🦯 Data Collection | Gathers biometric and location data |
| **Sensors** | 📊 Input | Heart rate, temperature, GPS coordinates |
| **Microcontroller** | 🧠 Processing | Processes sensor data and decision-making |
| **WiFi Module** | 📶 Live Monitoring | Sends real-time data to dashboard |
| **GSM Module** | 📩 Emergency Alerts | Sends SMS during critical events |
| **Web Dashboard** | 💻 Visualization | Real-time monitoring interface |
| **Rescue Coordination** | 🚨 Response | Quick emergency response with coordinates |

---

## ✨ Key Features

### Core Monitoring

| Feature | Icon | Description | Benefit |
|---------|------|-------------|---------|
| **Heart Rate Monitoring** | ❤️ | Tracks climber's pulse in real-time | Early detection of health anomalies |
| **Temperature Tracking** | 🌡️ | Monitors body and environmental temperature | Prevents hypothermia/heat exhaustion |
| **GPS Location** | 📍 | Captures precise latitude/longitude | Accurate rescue team coordination |

### Communication & Alerting

| Feature | Icon | Description | Benefit |
|---------|------|-------------|---------|
| **WiFi Dashboard** | 📶 | Live web-based monitoring interface | Real-time basecamp tracking |
| **GSM SMS Alerts** | 📩 | Sends emergency notifications | Works without internet in remote areas |
| **Auto-Distress Signals** | 🚨 | Triggered by critical health events | Faster emergency response |
| **Location Coordinates** | 🗺️ | Included in alert messages | Rescue teams know exact location |

### Advanced Capabilities

| Feature | Icon | Description |
|---------|------|-------------|
| **Multi-Alert Thresholds** | ⚠️ | Customizable health alert parameters |
| **Low-Power Design** | 🔋 | Optimized battery consumption |
| **Expandable Architecture** | 🧩 | Easy integration of additional sensors |
| **Robust Communication** | 🔐 | Reliable WiFi & GSM protocols |

---

## 🔩 Hardware Components

### Core Processing

| Component | Specifications | Purpose |
|-----------|----------------|---------|
| **Atmega328P Microcontroller** | 8-bit, 16MHz | Main processing unit, sensor data handling |
| **Power Management Module** | 5V/3.3V Regulator | Stable power distribution |

### Sensors & Inputs

| Sensor | Model (Example) | Output | Purpose |
|--------|-----------------|--------|---------|
| **Heart Rate Sensor** | Pulse Sensor / MAX30100 | PPM (Pulses Per Minute) | Cardiac monitoring |
| **Temperature Sensor** | DHT22 / DS18B20 | °C/°F | Body & environment temperature |
| **GPS Module** | Neo-6M / Neo-8M | Latitude, Longitude, Altitude | Location tracking |

### Communication Modules

| Module | Technology | Range | Use Case |
|--------|------------|-------|----------|
| **WiFi Module** | ESP8266 / WiFi Shield | ~100m (indoor) | Dashboard connectivity |
| **GSM Module** | SIM800L / SIM900 | Global (cellular) | Emergency SMS alerts |

### Power & Supporting Components

| Component | Capacity/Type | Function |
|-----------|---------------|------------|
| **Battery** | 3000-5000mAh Li-Po | Portable power source |
| **Charging Module** | Micro-USB/USB-C | Safe battery charging |
| **PCB** | Custom Design | Component integration |
| **Enclosure** | Weather-sealed housing | Physical protection |

---

## 👨‍💻 Software Stack

### Embedded Development

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Language** | C/C++ | Microcontroller firmware development |
| **IDE** | Arduino IDE / PlatformIO | Code compilation & upload |
| **Libraries** | Arduino Core, Sensor Libraries | Hardware abstraction & sensor APIs |
| **Protocols** | UART, SPI, I2C | Sensor & module communication |

### IoT & Connectivity

| Component | Technology | Role |
|-----------|-----------|------|
| **WiFi Communication** | HTTP/HTTPS | Dashboard data transmission |
| **GSM Protocol** | AT Commands | SMS emergency alerts |
| **Data Format** | JSON | Structured data exchange |
| **Server Backend** | Node.js / Python (optional) | Data processing & storage |

### Monitoring & Alerting

| Function | Implementation | Details |
|----------|----------------|---------|
| **Health Monitoring** | Real-time threshold checks | Alerts triggered on anomalies |
| **Location Tracking** | GPS coordinate parsing | Coordinates included in messages |
| **Alert Transmission** | Asynchronous messaging | Non-blocking alert dispatch |
| **Data Logging** | Local storage | Sensor data history |

### Web Dashboard

| Aspect | Technology | Features |
|--------|-----------|----------|
| **Frontend** | HTML5, CSS3, JavaScript | Real-time visualization |
| **Data Visualization** | Charts.js / D3.js | Heart rate, temperature graphs |
| **Mapping** | Google Maps API / Leaflet | Live location tracking |
| **Backend** | Node.js / Python Flask | API endpoints for data |
| **Database** | Firebase / MongoDB | Cloud data storage |

---

## 🚀 Getting Started

### Quick Links

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/cepdnaclk/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker" target="_blank">
        <strong>📂 GitHub Repository</strong><br>
        Source code & documentation
      </a>
    </td>
    <td align="center">
      <a href="https://cepdnaclk.github.io/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker" target="_blank">
        <strong>🌐 Project Page</strong><br>
        GitHub Pages site
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="http://www.ce.pdn.ac.lk/" target="_blank">
        <strong>🏫 Department</strong><br>
        Computer Engineering
      </a>
    </td>
    <td align="center">
      <a href="https://eng.pdn.ac.lk/" target="_blank">
        <strong>🎓 University</strong><br>
        University of Peradeniya
      </a>
    </td>
  </tr>
</table>

### Documentation Structure

Our comprehensive documentation includes:

| Section | Focus | Content |
|---------|-------|---------|
| 📋 **Project Overview** | Vision & Goals | Problem statement, objectives, scope |
| 🔧 **Hardware Design** | Physical Build | Sensor selection, circuit diagrams, wiring |
| 💾 **Firmware** | Embedded Code | Microcontroller programming, sensor drivers |
| 🌐 **Dashboard** | Web Interface | Frontend code, data visualization |
| 🧪 **Testing** | Validation | Test procedures, results, performance metrics |
| 📊 **Results** | Outputs | Graphs, screenshots, final observations |
| 🔮 **Future Work** | Improvements | Roadmap, enhancements, scalability |

---

## 👥 Team

<table align="center">
  <tr>
    <th>Registration</th>
    <th>Name</th>
    <th>Email</th>
    <th>Role</th>
  </tr>
  <tr>
    <td><strong>e21198</strong></td>
    <td>Sahan Jayasundara</td>
    <td><a href="mailto:e21198@eng.pdn.ac.lk">e21198@eng.pdn.ac.lk</a></td>
    <td>Hardware & Sensors</td>
  </tr>
  <tr>
    <td><strong>e21328</strong></td>
    <td>Prabash Rathnayaka</td>
    <td><a href="mailto:e21328@eng.pdn.ac.lk">e21328@eng.pdn.ac.lk</a></td>
    <td>Firmware & MCU</td>
  </tr>
  <tr>
    <td><strong>e21353</strong></td>
    <td>Pasan Sandeep</td>
    <td><a href="mailto:e21353@eng.pdn.ac.lk">e21353@eng.pdn.ac.lk</a></td>
    <td>Dashboard & Communication</td>
  </tr>
</table>

---

## 🔗 External Resources

| Resource | Link | Description |
|----------|------|-------------|
| **GitHub Repository** | [View Repository](https://github.com/cepdnaclk/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker){:target="_blank"} | Complete source code & docs |
| **GitHub Pages** | [Open Project Page](https://cepdnaclk.github.io/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker){:target="_blank"} | Hosted project website |
| **Department Website** | [Computer Engineering Dept](http://www.ce.pdn.ac.lk/){:target="_blank"} | Faculty information |
| **University Website** | [University of Peradeniya](https://eng.pdn.ac.lk/){:target="_blank"} | University portal |

---

## 📚 Documentation Sections

Navigate through our detailed documentation:

- **[Hardware Design](./docs/hardware/)** - Sensor specifications, circuit diagrams, PCB layout
- **[Firmware Documentation](./docs/firmware/)** - Code architecture, sensor drivers, communication protocols
- **[Dashboard Guide](./docs/dashboard/)** - Web interface features, data visualization
- **[Testing & Results](./docs/testing/)** - Test cases, performance metrics, validation results
- **[Future Improvements](./docs/improvements/)** - Planned enhancements, scalability roadmap

---

## 🎓 Academic Context

This project is developed as part of the **3rd Year Undergraduate Engineering Project** at the:

- **Faculty**: Engineering
- **Department**: Computer Engineering  
- **University**: University of Peradeniya
- **Year**: 2021

The project aims to design and implement a practical IoT-based safety solution that improves climber monitoring, enables rapid emergency response, and enhances rescue coordination in remote mountain environments.

### Project Objectives

✅ Design an integrated IoT device for climber safety  
✅ Implement real-time health and location monitoring  
✅ Develop emergency alert system with GPS coordinates  
✅ Create user-friendly monitoring dashboard  
✅ Test and validate system performance  
✅ Document comprehensive technical specifications  

---

## 📞 Contact & Support

For questions, suggestions, or contributions:

- **GitHub Issues**: [Report a bug or suggest a feature](https://github.com/cepdnaclk/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker/issues){:target="_blank"}
- **Email Team**: Reach out to any team member via email (see team section above)
- **Project Discussion**: Start a discussion on GitHub Discussions

---

<p align="center">
  <strong>🏔️ Mountain Climber Health and GPS Tracker</strong><br>
  <em>Enhancing Safety, Saving Lives</em><br><br>
  Department of Computer Engineering • Faculty of Engineering<br>
  University of Peradeniya 🎓
</p>

<p align="center">
  <strong>Version 1.0</strong> | Last Updated: June 2026<br>
  <a href="https://github.com/cepdnaclk/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker/blob/main/LICENSE" target="_blank">License</a> • 
  <a href="https://github.com/cepdnaclk/e21-3yp-Mountain-Climber-Health-and-GPS-Tracker" target="_blank">GitHub</a>
</p>

---
