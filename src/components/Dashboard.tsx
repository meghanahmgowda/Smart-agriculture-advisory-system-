import {
  Cloud,
  Sparkles,
  Bug,
  Leaf,
  TrendingUp,
  Cpu,
  Thermometer,
  Droplets,
  CloudSun,
  Umbrella,
  Volume2,
} from "lucide-react";
import type { View } from "./Navbar";

interface DashboardProps {
  userName: string;
  setView: (view: View) => void;
}

const features: { id: View; title: string; desc: string; icon: React.ElementType; color: string }[] = [
  {
    id: "weather",
    title: "Weather",
    desc: "7-day forecast & rain alerts",
    icon: Cloud,
    color: "bg-blue-500",
  },
  {
    id: "advisory",
    title: "AI Advisory",
    desc: "AI-powered farming suggestions",
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    id: "disease",
    title: "Disease Identifier",
    desc: "Scan leaves for diseases",
    icon: Bug,
    color: "bg-red-500",
  },
  {
    id: "crop",
    title: "Crop Selection",
    desc: "AI crop recommendation",
    icon: Leaf,
    color: "bg-green-500",
  },
  {
    id: "market",
    title: "Market Prices",
    desc: "Live market prices",
    icon: TrendingUp,
    color: "bg-amber-500",
  },
  {
    id: "iot",
    title: "IoT Hardware",
    desc: "IoT sensor readings",
    icon: Cpu,
    color: "bg-cyan-500",
  },
];

function speak(text: string) {
  if ("speechSynthesis" in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    window.speechSynthesis.speak(utter);
  }
}

export default function Dashboard({ userName, setView }: DashboardProps) {
  const advisory = `Good morning ${userName}. The weather is clear today with a temperature of 32.9°C and humidity at 49%. No rain is expected, so it's a great day for irrigation and field scouting. Consider checking your cotton crop for pest activity.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white shadow-xl md:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 opacity-10">
            <Leaf className="h-64 w-64" />
          </div>
          <p className="text-lg text-white/90">Welcome,</p>
          <h2 className="mt-1 flex items-center gap-2 text-4xl font-bold md:text-5xl">
            {userName} <span className="text-3xl">🌱</span>
          </h2>
          <p className="mt-2 text-white/90">AI-Powered Agriculture Advisory</p>

          <div className="mt-4 text-white/90">
            <p className="max-w-2xl leading-relaxed">{advisory}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
              <Thermometer className="h-4 w-4" /> 32.9°C
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
              <Droplets className="h-4 w-4" /> 49%
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
              <CloudSun className="h-4 w-4" /> Clear sky
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
              <Umbrella className="h-4 w-4" /> No rain expected
            </span>
          </div>

          <button
            onClick={() => speak(advisory)}
            className="mt-6 flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
          >
            <Volume2 className="h-4 w-4" /> Voice Output
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <button
              key={f.id}
              onClick={() => setView(f.id)}
              className="group rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${f.color} text-white shadow-md`}>
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{f.title}</h3>
              <p className="mt-1 text-gray-500">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
