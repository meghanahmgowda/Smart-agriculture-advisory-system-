import { useState } from "react";
import { ArrowLeft, Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from "lucide-react";
import type { View } from "./Navbar";

interface WeatherProps {
  setView: (view: View) => void;
}

const forecast = [
  { day: "Today", icon: Sun, temp: "33° / 24°", condition: "Clear sky", rain: "0%" },
  { day: "Tomorrow", icon: Cloud, temp: "32° / 25°", condition: "Partly cloudy", rain: "10%" },
  { day: "Wed", icon: CloudRain, temp: "29° / 24°", condition: "Light rain", rain: "70%" },
  { day: "Thu", icon: Cloud, temp: "30° / 23°", condition: "Cloudy", rain: "20%" },
  { day: "Fri", icon: Sun, temp: "34° / 25°", condition: "Sunny", rain: "0%" },
  { day: "Sat", icon: Cloud, temp: "31° / 24°", condition: "Partly cloudy", rain: "15%" },
  { day: "Sun", icon: CloudRain, temp: "28° / 23°", condition: "Thunderstorms", rain: "80%" },
];

export default function Weather({ setView }: WeatherProps) {
  const [location, setLocation] = useState("Nashik, Maharashtra");
  const locations = ["Nashik, Maharashtra", "Pune, Maharashtra", "Ludhiana, Punjab", "Coimbatore, Tamil Nadu"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => setView("dashboard")}
          className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <h2 className="mb-6 text-3xl font-bold text-green-800">Weather Forecast</h2>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Current weather */}
          <div className="col-span-2 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white shadow-lg md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90">{location}</p>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 rounded-lg bg-white/20 px-2 py-1 text-sm text-white outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="text-gray-800">
                      {loc}
                    </option>
                  ))}
                </select>
                <h3 className="text-6xl font-bold">32.9°C</h3>
                <p className="mt-1 text-lg text-white/90">Clear sky</p>
              </div>
              <Sun className="h-24 w-24 text-yellow-300" />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur-sm">
                <Droplets className="mx-auto h-6 w-6" />
                <p className="mt-1 text-sm">Humidity</p>
                <p className="text-lg font-semibold">49%</p>
              </div>
              <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur-sm">
                <Wind className="mx-auto h-6 w-6" />
                <p className="mt-1 text-sm">Wind</p>
                <p className="text-lg font-semibold">12 km/h</p>
              </div>
              <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur-sm">
                <Thermometer className="mx-auto h-6 w-6" />
                <p className="mt-1 text-sm">Feels like</p>
                <p className="text-lg font-semibold">35°C</p>
              </div>
            </div>
          </div>

          {/* Rain alert */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h4 className="text-lg font-bold text-gray-800">Rain Alerts</h4>
            <p className="mt-2 text-gray-600">
              No rain expected today. Light rain is forecasted for Wednesday. Plan irrigation accordingly.
            </p>
            <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
              Advisory: Protect harvested produce before Wednesday.
            </div>
          </div>
        </div>

        {/* 7-day forecast */}
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h4 className="mb-4 text-lg font-bold text-gray-800">7-Day Forecast</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {forecast.map((day) => (
              <div
                key={day.day}
                className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4 transition hover:bg-green-50"
              >
                <day.icon className="h-10 w-10 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-800">{day.day}</p>
                  <p className="text-sm text-gray-500">{day.condition}</p>
                  <p className="text-sm font-medium text-gray-700">{day.temp}</p>
                  <p className="text-xs text-blue-600">Rain: {day.rain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
