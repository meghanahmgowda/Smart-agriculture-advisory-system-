import { useState } from "react";
import { ArrowLeft, Leaf, Search, Sprout } from "lucide-react";
import type { View } from "./Navbar";

interface CropSelectionProps {
  setView: (view: View) => void;
}

const crops = [
  { name: "Cotton", type: "Fiber", season: "Kharif", climate: "Tropical", water: "Moderate", soil: "Loamy", profit: "High" },
  { name: "Wheat", type: "Cereal", season: "Rabi", climate: "Temperate", water: "Low", soil: "Clay loam", profit: "Medium" },
  { name: "Rice", type: "Cereal", season: "Kharif", climate: "Tropical", water: "High", soil: "Clay", profit: "Medium" },
  { name: "Sugarcane", type: "Cash", season: "Year-round", climate: "Tropical", water: "High", soil: "Loamy", profit: "High" },
  { name: "Maize", type: "Cereal", season: "Kharif", climate: "Subtropical", water: "Moderate", soil: "Sandy loam", profit: "Medium" },
  { name: "Soybean", type: "Oilseed", season: "Kharif", climate: "Subtropical", water: "Moderate", soil: "Loamy", profit: "High" },
  { name: "Groundnut", type: "Oilseed", season: "Rabi", climate: "Subtropical", water: "Low", soil: "Sandy loam", profit: "Medium" },
  { name: "Tomato", type: "Vegetable", season: "Year-round", climate: "Subtropical", water: "Moderate", soil: "Loamy", profit: "High" },
  { name: "Potato", type: "Vegetable", season: "Rabi", climate: "Temperate", water: "Moderate", soil: "Sandy loam", profit: "Medium" },
  { name: "Chickpea", type: "Pulse", season: "Rabi", climate: "Temperate", water: "Low", soil: "Clay loam", profit: "Medium" },
];

export default function CropSelection({ setView }: CropSelectionProps) {
  const [soil, setSoil] = useState("");
  const [climate, setClimate] = useState("");
  const [season, setSeason] = useState("");
  const [water, setWater] = useState("");
  const [recommendations, setRecommendations] = useState<typeof crops>([]);

  const recommend = () => {
    const filtered = crops.filter((c) => {
      return (
        (!soil || c.soil.toLowerCase().includes(soil.toLowerCase())) &&
        (!climate || c.climate.toLowerCase().includes(climate.toLowerCase())) &&
        (!season || c.season.toLowerCase().includes(season.toLowerCase())) &&
        (!water || c.water.toLowerCase().includes(water.toLowerCase()))
      );
    });
    setRecommendations(filtered.length ? filtered : crops);
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
          <Leaf className="h-8 w-8 text-green-500" /> Crop Selection
        </h2>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <select value={soil} onChange={(e) => setSoil(e.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500">
              <option value="">Soil Type</option>
              <option value="Loamy">Loamy</option>
              <option value="Clay">Clay</option>
              <option value="Sandy loam">Sandy loam</option>
              <option value="Clay loam">Clay loam</option>
            </select>
            <select value={climate} onChange={(e) => setClimate(e.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500">
              <option value="">Climate</option>
              <option value="Tropical">Tropical</option>
              <option value="Subtropical">Subtropical</option>
              <option value="Temperate">Temperate</option>
            </select>
            <select value={season} onChange={(e) => setSeason(e.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500">
              <option value="">Season</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Year-round">Year-round</option>
            </select>
            <select value={water} onChange={(e) => setWater(e.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500">
              <option value="">Water Availability</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button
            onClick={recommend}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-medium text-white shadow transition hover:bg-green-700 sm:w-auto sm:px-8"
          >
            <Search className="h-5 w-5" /> Get AI Recommendation
          </button>

          {recommendations.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((crop) => (
                <div key={crop.name} className="rounded-2xl bg-green-50 p-5 transition hover:bg-green-100">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-200 text-green-700">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">{crop.name}</h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>Type: <span className="font-medium text-gray-800">{crop.type}</span></p>
                    <p>Season: <span className="font-medium text-gray-800">{crop.season}</span></p>
                    <p>Climate: <span className="font-medium text-gray-800">{crop.climate}</span></p>
                    <p>Water: <span className="font-medium text-gray-800">{crop.water}</span></p>
                    <p>Soil: <span className="font-medium text-gray-800">{crop.soil}</span></p>
                    <p>Profit: <span className="font-medium text-green-700">{crop.profit}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
