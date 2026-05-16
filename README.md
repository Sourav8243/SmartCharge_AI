<p align="center"> <img src="https://img.shields.io/badge/Platform-Mobile%20%7C%20Web-green?style=for-the-badge"> <img src="https://img.shields.io/badge/AI-Enabled-blue?style=for-the-badge"> <img src="https://img.shields.io/badge/EV-Smart%20Charging-success?style=for-the-badge"> <img src="https://img.shields.io/badge/Status-Active%20Development-orange?style=for-the-badge"> </p>

📖 Overview

SmartCharge AI is an intelligent EV charging assistance system designed to reduce EV range anxiety by proactively helping drivers locate nearby charging stations before the battery becomes critically low.

Unlike traditional EV dashboards that only display the remaining range, SmartCharge AI provides:

✅ Real-time battery monitoring

✅ Smart threshold-based charging alerts

✅ GPS-powered charging station detection

✅ AI-based range prediction

✅ Real-time navigation assistance

✨ Key Innovation

Traditional EV Systems:

Remaining Range: 45 km

SmartCharge AI:

⚠️ Battery below threshold detected.

🔋 6 charging stations found within 10 km.

📍 Nearest Station: 3.2 km away.

🗺️ Navigation started.


🚀 Features
🔋 Real-Time Battery Monitoring

-Live battery percentage tracking

-Remaining driving range calculation

-Dynamic EV analytics dashboard


⚠️ Threshold-Based Smart Alerts
-User-defined battery threshold

-Automatic low-range notifications

-Intelligent charging recommendations


📍 GPS-Based Charging Station Detection

-Real-time location tracking

-Nearby charging station search

-Radius-based filtering system


🧠 AI-Based Range Prediction

-Predicts remaining EV range using:

-Driving speed

-Traffic conditions

-AC usage

-Driving behavior

-Road conditions


🗺️ Navigation Assistance
-Google Maps integration

-Turn-by-turn navigation

-Optimal charging route suggestion


🚨 Emergency Battery Mode

-Critical battery alerts

-Fastest reachable charger recommendation

-Emergency assistance system


🏗️ System Architecture
 EV Battery Sensor
          ↓
 Battery Monitoring Module
          ↓
 Threshold Detection Engine
          ↓
 GPS Location Tracking
          ↓
 Charging Station API
          ↓
 AI Recommendation Engine
          ↓
 Smart Dashboard / Mobile App
          ↓
 Navigation Assistance


🛠️ Tech Stack
<table> <tr> <td><b>Frontend</b></td> <td>React Native / Expo</td> </tr> <tr> <td><b>Backend</b></td> <td>Node.js / Firebase</td> </tr> <tr> <td><b>Database</b></td> <td>Supabase / Firebase</td> </tr> <tr> <td><b>AI Module</b></td> <td>Python</td> </tr> <tr> <td><b>Maps & GPS</b></td> <td>Google Maps API</td> </tr> <tr> <td><b>Charging Data</b></td> <td>OpenChargeMap API</td> </tr> <tr> <td><b>Language</b></td> <td>TypeScript</td> </tr> </table>


📂 Project Structure
project/
│
├── app/                 # Application screens & routes
├── components/          # Reusable UI components
├── assets/              # Images & icons
├── hooks/               # Custom hooks
├── constants/           # Constants & configurations
├── lib/                 # APIs & utility functions
├── supabase/            # Database configuration
├── types/               # TypeScript types
├── package.json
└── app.json


⚙️ Installation

1️⃣ Clone Repository

git clone https://github.com/your-username/smartcharge-ai.git

cd smartcharge-ai

2️⃣ Install Dependencies

npm install

3️⃣ Start Development Server

npm run dev


🔑 Environment Variables

Create a .env file in the root directory:

EXPO_PUBLIC_SUPABASE_URL=your_supabase_url

EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

GOOGLE_MAPS_API_KEY=your_google_maps_api_key


📱 Application Screens

Screen	Description

Splash Screen	App startup screen

Authentication	Login & Register

Dashboard	EV analytics overview

Battery Analytics	Real-time battery monitoring

Charging Stations	Nearby charging station map

Navigation	Route guidance

Emergency Alert	Critical battery warning

Settings	App configurations


🔄 Workflow

🎯 Functional Modules

Smart EV Dashboard

Battery Monitoring System

Charging Recommendation Engine

GPS Tracking Module

AI Prediction Module

Emergency Alert System

Navigation Assistance


🌍 SDG Goals

✅ SDG 7 — Affordable and Clean Energy

✅ SDG 9 — Industry, Innovation and Infrastructure

✅ SDG 11 — Sustainable Cities and Communities

✅ SDG 13 — Climate Action


🔮 Future Scope

Smart city integration

Voice assistant support

Charging slot booking

Battery health prediction

Vehicle-to-Grid (V2G)

Solar charging recommendations

Real EV hardware integration


📊 Why SmartCharge AI?

Traditional EV System	SmartCharge AI

Only shows remaining range	Intelligent charging assistance

No proactive alerts	Smart threshold-based warnings

No AI prediction	AI-powered range analytics

Manual charger search	Automatic nearby charger detection

No emergency support	Emergency battery mode
