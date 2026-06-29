import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  Cpu,
  Droplets,
  Thermometer,
  Wind,
  Activity,
  Battery,
  Wifi,
  WifiOff,
  Search,
  Loader2,
  Plug,
  Unplug,
  Settings,
  AlertCircle,
} from "lucide-react";
import type { View } from "./Navbar";

interface IoTHardwareProps {
  setView: (view: View) => void;
}

interface Sensor {
  label: string;
  key: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  min: number;
  max: number;
}

interface EspReadings {
  soilMoisture?: number;
  soilTemperature?: number;
  airHumidity?: number;
  soilPh?: number;
  npk?: number;
  battery?: number;
}

function isValidIp(ip: string) {
  return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
}

export default function IoTHardware({ setView }: IoTHardwareProps) {
  const [connected, setConnected] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [deviceIp, setDeviceIp] = useState<string>("");
  const [inputIp, setInputIp] = useState<string>("");
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [sensors, setSensors] = useState<Sensor[]>([
    { label: "Soil Moisture", key: "soilMoisture", value: 0, unit: "%", icon: Droplets, color: "bg-blue-500", min: 0, max: 100 },
    { label: "Soil Temperature", key: "soilTemperature", value: 0, unit: "°C", icon: Thermometer, color: "bg-orange-500", min: 0, max: 60 },
    { label: "Air Humidity", key: "airHumidity", value: 0, unit: "%", icon: Wind, color: "bg-cyan-500", min: 0, max: 100 },
    { label: "Soil pH", key: "soilPh", value: 0, unit: "", icon: Activity, color: "bg-purple-500", min: 0, max: 14 },
    { label: "NPK Level", key: "npk", value: 0, unit: "ppm", icon: Cpu, color: "bg-green-500", min: 0, max: 200 },
    { label: "Battery", key: "battery", value: 0, unit: "%", icon: Battery, color: "bg-emerald-500", min: 0, max: 100 },
  ]);

  const updateSensors = (readings: EspReadings) => {
    setSensors((prev) =>
      prev.map((s) => ({
        ...s,
        value: readings[s.key as keyof EspReadings] ?? 0,
      }))
    );
    setLastSync(new Date().toLocaleTimeString("en-IN"));
  };

  const fetchReadings = async (ip: string) => {
    try {
      const res = await fetch(`http://${ip}/sensors`, { method: "GET", mode: "cors" });
      if (!res.ok) throw new Error("Failed");
      const data: EspReadings = await res.json();
      updateSensors(data);
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError("Could not reach ESP32. Check IP, Wi-Fi, and CORS settings.");
      return false;
    }
  };

  const startPolling = (ip: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    fetchReadings(ip);
    intervalRef.current = setInterval(() => fetchReadings(ip), 3000);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const connect = async (ip: string) => {
    setError(null);
    if (!isValidIp(ip)) {
      setError("Please enter a valid IP address like 192.168.1.45");
      return;
    }
    setScanning(true);
    const ok = await fetchReadings(ip);
    setScanning(false);
    if (ok) {
      setConnected(true);
      setDeviceIp(ip);
      startPolling(ip);
    }
  };

  const disconnect = () => {
    stopPolling();
    setConnected(false);
    setDeviceIp("");
    setLastSync(null);
    setError(null);
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const discoverDevices = async () => {
    setScanning(true);
    setError(null);
    // Common local subnet scan (very basic demo). In production use mDNS/Bonjour.
    const base = "192.168.1";
    const promises = [];
    for (let i = 1; i <= 254; i++) {
      const ip = `${base}.${i}`;
      promises.push(
        fetch(`http://${ip}/sensors`, { method: "GET", mode: "cors" })
          .then((res) => (res.ok ? ip : null))
          .catch(() => null)
      );
    }
    const found = await Promise.all(promises);
    const first = found.find((ip) => ip !== null);
    setScanning(false);
    if (first) {
      setInputIp(first);
      connect(first);
    } else {
      setError("No ESP32 found on 192.168.1.x automatically. Please enter the IP manually.");
    }
  };

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

        {/* Connection status bar */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  connected ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                {connected ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm text-gray-500">ESP32 Device Status</p>
                <p className={`font-semibold ${connected ? "text-green-700" : "text-gray-500"}`}>
                  {connected ? "Connected & Receiving Data" : "No ESP32 connected"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {connected ? (
                <>
                  <span className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-green-700">
                    <Plug className="h-4 w-4" /> Device IP: {deviceIp}
                  </span>
                  <span>Last sync: {lastSync || "--"}</span>
                  <button
                    onClick={disconnect}
                    className="flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-red-700 transition hover:bg-red-200"
                  >
                    <Unplug className="h-4 w-4" /> Disconnect
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={discoverDevices}
                    disabled={scanning}
                    className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 font-medium text-white shadow transition hover:bg-cyan-700 disabled:opacity-70"
                  >
                    {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {scanning ? "Scanning..." : "Auto-Scan Network"}
                  </button>
                  <button
                    onClick={() => setShowSetup(!showSetup)}
                    className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-200"
                  >
                    <Settings className="h-4 w-4" /> Manual IP
                  </button>
                </div>
              )}
            </div>
          </div>

          {!connected && showSetup && (
            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <label className="mb-1 block text-xs font-semibold text-gray-500">Enter ESP32 IP Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputIp}
                  onChange={(e) => setInputIp(e.target.value)}
                  placeholder="e.g. 192.168.1.45"
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-green-200 transition focus:border-green-500 focus:ring"
                />
                <button
                  onClick={() => connect(inputIp)}
                  disabled={scanning}
                  className="rounded-xl bg-green-600 px-5 py-2 font-medium text-white shadow transition hover:bg-green-700 disabled:opacity-70"
                >
                  {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Your ESP32 must be on the same Wi-Fi network and expose a JSON endpoint at{" "}
                <code className="rounded bg-gray-200 px-1">http://&lt;ip&gt;/sensors</code>
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {connected ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sensors.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
              >
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
                    style={{ width: `${Math.min(100, Math.max(0, ((s.value - s.min) / (s.max - s.min)) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-80 flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
            <WifiOff className="mb-4 h-16 w-16 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-700">No ESP32 connected</h3>
            <p className="mt-2 max-w-md text-gray-500">
              Connect an ESP32 soil/weather sensor node to view live readings. Use Auto-Scan or enter the device IP manually.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
