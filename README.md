# Smart Agri — AI-Powered Agriculture Advisory

A responsive React + Vite + Tailwind CSS web application for farmers that provides AI-based crop advisory, weather forecasts, disease identification, IoT sensor monitoring, and state-wise market prices with variety-level detail.

## Live Demo

Open `dist/index.html` after building, or run the dev server locally.

## Features

- **Farmer Login / Admin Login** demo with auto-registration
- **Dashboard** with weather summary, 6 feature modules, and voice output
- **Weather** — 7-day forecast, rain alerts, humidity, wind, feels-like temp
- **AI Advisory** — AI farming assistant with organic/chemical suggestions
- **Disease Identifier** — Upload a leaf/fruit photo and get:
  - Plant identified by the model
  - Disease detected
  - Confidence & spoilage percentage
  - Cure (organic + chemical) and prevention tips
  - Voice output for the diagnosis
- **Crop Selection** — AI crop recommendation by soil, climate, season, water
- **Market Prices** — State and district filters, category cards, variety filter/chips, best-market comparison, 1-year price history chart
- **IoT Hardware** — Live sensor readings for soil moisture, temperature, humidity, pH, NPK, battery

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 7
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Charts:** Recharts
- **AI / ML:** TensorFlow.js with a PlantVillage-trained model (`tf.loadLayersModel`)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

The production build is a single-file app at `dist/index.html` thanks to `vite-plugin-singlefile`.

## Project Structure

```
.
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── App.tsx                    # Main app shell with auth + navigation
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Tailwind import
│   ├── components/
│   │   ├── Login.tsx              # Login / auto-registration screen
│   │   ├── Navbar.tsx             # Top navigation
│   │   ├── Dashboard.tsx          # Home dashboard
│   │   ├── Weather.tsx            # Weather forecast page
│   │   ├── AIAdvisory.tsx         # AI chat assistant
│   │   ├── DiseaseIdentifier.tsx  # Leaf/fruit disease scanner
│   │   ├── CropSelection.tsx      # Crop recommendation engine
│   │   ├── MarketPrices.tsx       # State/district/variety market prices
│   │   └── IoTHardware.tsx        # IoT sensor dashboard
│   ├── data/
│   │   └── districts.ts           # All Indian states & districts
│   └── utils/
│       ├── cn.ts                  # Tailwind class helper
│       └── plantDisease.ts        # TF.js model loading + diagnosis builder
└── dist/
    └── index.html                 # Production build
```

## AI Disease Identifier

The disease identifier uses a pre-trained TensorFlow.js model originally trained on the **PlantVillage dataset**. It can identify 38 plant-disease combinations and returns:

- Detected plant
- Detected disease (or healthy)
- Confidence score
- Estimated spoilage / damage percentage
- Cause, symptoms, organic cure, chemical cure, and prevention measures

The model is loaded from a CDN. If loading fails, the UI shows a retry option.

## Market Prices Data

Market prices are generated deterministically for demonstration purposes. The catalog includes a broad set of Indian crops, vegetables, fruits, spices, cereals, pulses, oilseeds, and cash crops with popular varieties. Select a state, district, category, crop, and variety to see current price, best market, and a 1-year price history chart.

## ESP32 IoT Hardware Integration

The **IoT Hardware** page can connect to a real ESP32 sensor node:

1. Flash the sample sketch from `esp32/smart_agri_esp32.ino` to your ESP32.
2. Connect the ESP32 to the same Wi-Fi network as your computer/phone.
3. Open the serial monitor to see the ESP32 IP address.
4. In the app, go to **IoT Hardware** and either:
   - Click **Auto-Scan Network** to search `192.168.1.x`, or
   - Click **Manual IP** and enter the ESP32 IP address.

The app fetches sensor readings from the ESP32 endpoint:

```
GET http://<esp32-ip>/sensors
```

Expected JSON response:

```json
{
  "soilMoisture": 42.5,
  "soilTemperature": 26.5,
  "airHumidity": 58.0,
  "soilPh": 6.8,
  "npk": 72.0,
  "battery": 86.0
}
```

### CORS Note

The ESP32 sketch already sends `Access-Control-Allow-Origin: *` so the browser can read the response. If you write your own firmware, make sure to include this header.

## Notes

- This is a demo application. The AI model predictions and market prices are for demonstration only.
- For production use, replace mock data with real APIs (weather, market rates, IoT sensors).
- The PlantVillage model recognizes only the plants/diseases it was trained on. Leaves from plants outside the dataset may produce low-confidence or incorrect predictions.

## License

MIT
