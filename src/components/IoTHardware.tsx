import { useEffect, useState } from "react";
import { ArrowLeft, Cpu, Droplets, Thermometer, Wind, Activity, Battery } from "lucide-react";
import type { View } from "./Navbar";

interface IoTHardwareProps {
  setView: (view: View) => void;
}

interface Sensor {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  min: number;
  max: number;
}

function random(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

export default function IoTHardware({ setView }: IoTHardwareProps) {
  const [sensors, setSensors] = useState<Sensor[]>([
    { label: "Soil Moisture", value: 42, unit: "%", icon: Droplets, color: "bg-blue-500", min: 20, max: 70 },
    { label: "Soil Temperature", value: 26.5, unit: "°C", icon: Thermometer, color: "bg-orange-500", min: 18, max: 36 },
    { label: "Air Humidity", value: 58, unit: "%", icon: Wind, color: "bg-cyan-500", min: 30, max: 90 },
    { label: "Soil pH", value: 6.8, unit: "", icon: Activity, color: "bg-purple-500", min: 5.5, max: 8.5 },
    { label: "NPK Level", value: 72, unit: "ppm", icon: Cpu, color: "bg-green-500", min: 40, max: 120 },
    { label: "Battery", value: 86, unit: "%", icon: Battery, color: "bg-emerald-500", min: 70, max: 100 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          value: s.label === "Battery" ? Math.min(100, random(s.min, s.max)) : random(s.min, s.max),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => setView("dashboard")}
          className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-green-800">
          <Cpu className="h-8 w-8 text-cyan-500" /> IoT Hardware
        </h2>

        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" /> Device Online
            </span>
            <span>Device ID: SA-IoT-8821</span>
            <span>Last sync: Just now</span>
            <span>Location: Field A - North Block</span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sensors.map((s) => (
            <div key={s.label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">
                    {s.value}
                    <span className="ml-1 text-base font-medium text-gray-500">{s.unit}</span>
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.color} text-white`}>
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${s.color}`}
                  style={{ width: `${Math.min(100, ((s.value - s.min) / (s.max - s.min)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
