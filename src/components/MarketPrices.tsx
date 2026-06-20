import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Volume2,
  Star,
  MapPin,
  ChevronDown,
  Carrot,
  Apple,
  Flame,
  Wheat,
  Bean,
  Droplets,
  Sprout,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { View } from "./Navbar";
import { stateDistricts, allStates } from "../data/districts";

interface MarketPricesProps {
  setView: (view: View) => void;
}

interface CropDef {
  name: string;
  category: Category;
  basePrice: number;
  varieties: string[];
}

type Category =
  | "Vegetables"
  | "Fruits"
  | "Spices"
  | "Cereals"
  | "Pulses"
  | "Oilseeds"
  | "Cash Crops";

interface MarketEntry {
  crop: string;
  variety: string;
  category: Category;
  state: string;
  district: string;
  market: string;
  price: number;
  change: number;
}

const categories: { id: Category; icon: React.ElementType; color: string }[] = [
  { id: "Vegetables", icon: Carrot, color: "bg-green-500" },
  { id: "Fruits", icon: Apple, color: "bg-pink-500" },
  { id: "Spices", icon: Flame, color: "bg-orange-500" },
  { id: "Cereals", icon: Wheat, color: "bg-amber-500" },
  { id: "Pulses", icon: Bean, color: "bg-lime-500" },
  { id: "Oilseeds", icon: Droplets, color: "bg-cyan-500" },
  { id: "Cash Crops", icon: Sprout, color: "bg-violet-500" },
];


const cropCatalog: CropDef[] = [
  // Vegetables
  { name: "Tomato", category: "Vegetables", basePrice: 31, varieties: ["Arka Rakshak", "Arka Vikas", "Pusa Ruby", "Punjab Chhuhara", "Pant T-9", "Vaishali", "Abhilasha", "Arka Saurabh", "Pusa Sheetal", "NS-121", "Dhanraj", "Sel-7"] },
  { name: "Potato", category: "Vegetables", basePrice: 15, varieties: ["Kufri Jyoti", "Kufri Chandramukhi", "Kufri Pukhraj", "Kufri Sindhuri", "Kufri Badshah"] },
  { name: "Onion", category: "Vegetables", basePrice: 18, varieties: ["Red Nasik", "Pusa Red", "Agrifound Dark Red", "Bellary", "White Onion"] },
  { name: "Brinjal", category: "Vegetables", basePrice: 22, varieties: ["Purple Long", "Pusa Purple", "Arka Navneet", "Manjari Gota"] },
  { name: "Cauliflower", category: "Vegetables", basePrice: 25, varieties: ["Pusa Snowball", "Pusa Hybrid", "Snowball-16"] },
  { name: "Cabbage", category: "Vegetables", basePrice: 20, varieties: ["Golden Acre", "Pusa Drumhead", "Pride of India"] },
  { name: "Carrot", category: "Vegetables", basePrice: 30, varieties: ["Pusa Kesar", "Nantes", "Imperator"] },
  { name: "Radish", category: "Vegetables", basePrice: 18, varieties: ["Pusa Chetki", "Japanese White"] },
  { name: "Spinach", category: "Vegetables", basePrice: 20, varieties: ["Pusa Palak", "All Green"] },
  { name: "Bitter Gourd", category: "Vegetables", basePrice: 35, varieties: ["Pusa Do Mausami", "Co-1"] },
  { name: "Bottle Gourd", category: "Vegetables", basePrice: 22, varieties: ["Pusa Summer Prolific Long", "Co-1"] },
  { name: "Ridge Gourd", category: "Vegetables", basePrice: 28, varieties: ["Pusa Nasdar", "Co-1"] },
  { name: "Cucumber", category: "Vegetables", basePrice: 24, varieties: ["Pusa Sanyog", "Japanese Long Green"] },
  { name: "French Beans", category: "Vegetables", basePrice: 40, varieties: ["Contender", "Pusa Parvati"] },
  { name: "Capsicum", category: "Vegetables", basePrice: 45, varieties: ["California Wonder", "Yolo Wonder", "Arka Gaurav"] },
  { name: "Chilli", category: "Vegetables", basePrice: 55, varieties: ["Guntur Sannam", "Byadagi", "Kashmiri", "Jwala", "Bhut Jolokia"] },
  { name: "Garlic", category: "Vegetables", basePrice: 90, varieties: ["Agrifound White", "G-282"] },
  { name: "Ginger", category: "Vegetables", basePrice: 120, varieties: ["Rio-de-Janeiro", "Suprabha", "Suruchi"] },
  { name: "Okra", category: "Vegetables", basePrice: 32, varieties: ["Pusa Sawani", "Arka Anamika", "Parbhani Kranti"] },
  { name: "Peas", category: "Vegetables", basePrice: 38, varieties: ["Arkel", "Bonneville"] },
  { name: "Pumpkin", category: "Vegetables", basePrice: 20, varieties: ["Pusa Vishwas", "Kashi Harit"] },
  { name: "Sweet Potato", category: "Vegetables", basePrice: 16, varieties: ["Sree Bhadra", "Co-3"] },
  { name: "Beetroot", category: "Vegetables", basePrice: 26, varieties: ["Crimson Globe", "Detroit Dark Red"] },
  { name: "Fenugreek", category: "Vegetables", basePrice: 22, varieties: ["Kasuri", "Pusa Early Bunching"] },
  { name: "Coriander", category: "Vegetables", basePrice: 28, varieties: ["CS-4", "Swathi"] },
  { name: "Mint", category: "Vegetables", basePrice: 24, varieties: ["Mentholyptus"] },
  { name: "Turnip", category: "Vegetables", basePrice: 19, varieties: ["Pusa Chandrima", "Purple Top White Globe"] },
  { name: "Yam", category: "Vegetables", basePrice: 30, varieties: ["Sree Latha", "CO-1"] },

  // Fruits
  { name: "Banana", category: "Fruits", basePrice: 21, varieties: ["Cavendish", "Robusta", "Poovan", "Nendran", "Red Banana"] },
  { name: "Mango", category: "Fruits", basePrice: 120, varieties: ["Alphonso", "Kesar", "Dasheri", "Banganapalli", "Langra", "Chaunsa", "Himsagar", "Neelam", "Totapuri"] },
  { name: "Apple", category: "Fruits", basePrice: 85, varieties: ["Royal Delicious", "Red Delicious", "Golden Delicious", "Shimla Apple", "Kashmiri Apple"] },
  { name: "Grapes", category: "Fruits", basePrice: 56, varieties: ["Thompson Seedless", "Sonaka", "Anab-e-Shahi", "Bangalore Blue"] },
  { name: "Orange", category: "Fruits", basePrice: 40, varieties: ["Nagpur Mandarin", "Kinnow", "Malta"] },
  { name: "Sweet Lime", category: "Fruits", basePrice: 38, varieties: ["Mosambi"] },
  { name: "Pomegranate", category: "Fruits", basePrice: 95, varieties: ["Bhagwa", "Ganesh", "Ruby"] },
  { name: "Papaya", category: "Fruits", basePrice: 28, varieties: ["Red Lady", "Pusa Dwarf", "CO-2"] },
  { name: "Guava", category: "Fruits", basePrice: 42, varieties: ["Allahabad Safeda", "Lucknow-49", "L-49"] },
  { name: "Watermelon", category: "Fruits", basePrice: 18, varieties: ["Sugar Baby", "Arka Manik", "Kiran"] },
  { name: "Muskmelon", category: "Fruits", basePrice: 32, varieties: ["Pusa Sharbati", "Arka Jeet"] },
  { name: "Pineapple", category: "Fruits", basePrice: 45, varieties: ["Kew", "Queen"] },
  { name: "Sapota", category: "Fruits", basePrice: 40, varieties: ["Kalipatti", "Cricket Ball"] },
  { name: "Jackfruit", category: "Fruits", basePrice: 35, varieties: ["Khaja", "Borsha"] },
  { name: "Custard Apple", category: "Fruits", basePrice: 55, varieties: ["Balanagar", "Red Sitaphal"] },
  { name: "Litchi", category: "Fruits", basePrice: 140, varieties: ["Shahi", "China"] },
  { name: "Kiwi", category: "Fruits", basePrice: 180, varieties: ["Hayward", "Allison"] },
  { name: "Pear", category: "Fruits", basePrice: 70, varieties: ["Bartlett", "Kieffer"] },
  { name: "Peach", category: "Fruits", basePrice: 110, varieties: ["July Elberta", "Sharbati"] },
  { name: "Plum", category: "Fruits", basePrice: 100, varieties: ["Santa Rosa", "Methley"] },
  { name: "Apricot", category: "Fruits", basePrice: 130, varieties: ["New Castle", "Kaisha"] },
  { name: "Cherry", category: "Fruits", basePrice: 250, varieties: ["Mahaleb", "Mazzard"] },
  { name: "Strawberry", category: "Fruits", basePrice: 160, varieties: ["Chandler", "Camarosa"] },
  { name: "Jamun", category: "Fruits", basePrice: 60, varieties: ["Rajamundry", "Paras"] },
  { name: "Amla", category: "Fruits", basePrice: 50, varieties: ["Banarasi", "Chakaiya"] },

  // Spices
  { name: "Turmeric", category: "Spices", basePrice: 75, varieties: ["Salem", "Rajapore", "Erode", "Nizamabad"] },
  { name: "Red Chilli", category: "Spices", basePrice: 90, varieties: ["Guntur Sannam", "Byadagi", "Teja", "Kashmiri", "Bird Eye"] },
  { name: "Coriander Seed", category: "Spices", basePrice: 70, varieties: ["CS-4", "Sindhu", "Sadhana"] },
  { name: "Cumin", category: "Spices", basePrice: 180, varieties: ["Gujarat Cumin", "Rajasthan Cumin"] },
  { name: "Black Pepper", category: "Spices", basePrice: 320, varieties: ["Malabar", "Tellicherry"] },
  { name: "Cardamom", category: "Spices", basePrice: 1200, varieties: ["Alleppey Green", "Coorg Green"] },
  { name: "Cloves", category: "Spices", basePrice: 900, varieties: ["Zanzibar", "Madagascar"] },
  { name: "Cinnamon", category: "Spices", basePrice: 250, varieties: ["Ceylon", "Cassia"] },
  { name: "Mustard Seed", category: "Spices", basePrice: 54, varieties: ["Pusa Bold", "Varuna", "Yellow Sarson"] },
  { name: "Fenugreek Seed", category: "Spices", basePrice: 65, varieties: ["Kasuri"] },
  { name: "Fennel", category: "Spices", basePrice: 110, varieties: ["Gujarat Fennel", "PF-35"] },
  { name: "Ajwain", category: "Spices", basePrice: 140, varieties: ["Ajwain Local"] },
  { name: "Nutmeg", category: "Spices", basePrice: 650, varieties: ["Myristica"] },
  { name: "Bay Leaf", category: "Spices", basePrice: 120, varieties: ["Indian Bay Leaf"] },
  { name: "Tamarind", category: "Spices", basePrice: 80, varieties: ["Reddy", "Mathuram"] },
  { name: "Dry Ginger", category: "Spices", basePrice: 150, varieties: ["Cochin", "Calicut"] },

  // Cereals
  { name: "Wheat", category: "Cereals", basePrice: 24.5, varieties: ["Sharbati", "Lokwan", "HD-2967", "PBW-343", "Kalyan Sona"] },
  { name: "Rice", category: "Cereals", basePrice: 42, varieties: ["Basmati 1121", "Pusa Basmati", "Sugandha", "Sona Masoori", "IR-36", "MTU-1010"] },
  { name: "Maize", category: "Cereals", basePrice: 18.5, varieties: ["Yellow Corn", "White Corn", "Sweet Corn"] },
  { name: "Bajra", category: "Cereals", basePrice: 16, varieties: ["HB-3", "ICTP-8203"] },
  { name: "Jowar", category: "Cereals", basePrice: 22, varieties: ["CSH-6", "Maldandi"] },
  { name: "Barley", category: "Cereals", basePrice: 20, varieties: ["RD-2035", "RD-2552"] },
  { name: "Ragi", category: "Cereals", basePrice: 35, varieties: ["GPU-28", "MR-1"] },
  { name: "Oats", category: "Cereals", basePrice: 40, varieties: ["Kent", "Sabzar"] },

  // Pulses
  { name: "Chickpea", category: "Pulses", basePrice: 51, varieties: ["Desi", "Kabuli", "JG-11"] },
  { name: "Moong", category: "Pulses", basePrice: 78, varieties: ["Sona", "Pusa Vishal", "K-851"] },
  { name: "Tur Dal", category: "Pulses", basePrice: 82, varieties: ["Vamban-1", "BDN-711", "Asha"] },
  { name: "Urad", category: "Pulses", basePrice: 74, varieties: ["T-9", "PU-31"] },
  { name: "Masoor", category: "Pulses", basePrice: 68, varieties: ["Moongi", "IPL-316"] },
  { name: "Rajma", category: "Pulses", basePrice: 95, varieties: ["Jammu", "Kashmir"] },
  { name: "Lobia", category: "Pulses", basePrice: 60, varieties: ["Pusa Komal", "C-152"] },
  { name: "Horse Gram", category: "Pulses", basePrice: 55, varieties: ["Hebbal Hurali"] },
  { name: "Field Pea", category: "Pulses", basePrice: 48, varieties: ["Rachna", "Swarnapati"] },

  // Oilseeds
  { name: "Groundnut", category: "Oilseeds", basePrice: 62, varieties: ["Girnar-3", "Jyoti", "Kadiri-6"] },
  { name: "Soybean", category: "Oilseeds", basePrice: 47, varieties: ["JS-335", "NRC-37"] },
  { name: "Mustard", category: "Oilseeds", basePrice: 54, varieties: ["Pusa Bold", "Varuna", "Rohini"] },
  { name: "Sunflower", category: "Oilseeds", basePrice: 58, varieties: ["KBSH-44", "Morden"] },
  { name: "Sesame", category: "Oilseeds", basePrice: 90, varieties: ["Gujarat Til-2", "RT-346"] },
  { name: "Castor", category: "Oilseeds", basePrice: 42, varieties: ["GCH-4", "GCH-7"] },
  { name: "Linseed", category: "Oilseeds", basePrice: 52, varieties: ["Neelum", "Shekhar"] },
  { name: "Safflower", category: "Oilseeds", basePrice: 48, varieties: ["A-1", "Bhima"] },
  { name: "Niger Seed", category: "Oilseeds", basePrice: 85, varieties: ["GA-10"] },
  { name: "Coconut", category: "Oilseeds", basePrice: 35, varieties: ["West Coast Tall", "East Coast Tall"] },

  // Cash Crops
  { name: "Cotton", category: "Cash Crops", basePrice: 72, varieties: ["Shankar-6", "MCU-5", "DCH-32"] },
  { name: "Sugarcane", category: "Cash Crops", basePrice: 3.4, varieties: ["Co-0238", "Co-86032", "CoM-0265"] },
  { name: "Jute", category: "Cash Crops", basePrice: 45, varieties: ["JRO-524", "JRC-321"] },
  { name: "Tobacco", category: "Cash Crops", basePrice: 150, varieties: ["Flue Cured Virginia", "Bidi Tobacco"] },
  { name: "Tea", category: "Cash Crops", basePrice: 280, varieties: ["Assam", "Darjeeling", "Nilgiri"] },
  { name: "Coffee", category: "Cash Crops", basePrice: 220, varieties: ["Arabica", "Robusta"] },
  { name: "Rubber", category: "Cash Crops", basePrice: 180, varieties: ["RRII-105", "RRIM-600"] },
  { name: "Arecanut", category: "Cash Crops", basePrice: 340, varieties: ["Mangala", "Sumangala"] },
  { name: "Betelnut", category: "Cash Crops", basePrice: 280, varieties: ["Kalipatti", "Mysore"] },
];

function seededRandom(seedText: string) {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) {
    seed = (seed + seedText.charCodeAt(i) * (i + 1)) % 9973;
  }
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function getEntry(crop: CropDef, variety: string, state: string, district: string): MarketEntry {
  const rand = seededRandom(`${crop.name}-${variety}-${state}-${district}`);
  const variation = rand() * 0.2 - 0.1; // ±10%
  const price = Math.max(1, Math.round(crop.basePrice * (1 + variation)));
  const change = Math.round((rand() * 6 - 3) * 10) / 10; // -3% to +3%
  return {
    crop: crop.name,
    variety,
    category: crop.category,
    state,
    district,
    market: `${district} APMC Mandi`,
    price,
    change,
  };
}

function last12Months(): string[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const list: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    list.push(`${months[d.getMonth()]} '${d.getFullYear().toString().slice(-2)}`);
  }
  return list;
}

function generateHistory(entry: MarketEntry): { month: string; price: number }[] {
  const months = last12Months();
  const rand = seededRandom(`${entry.crop}-${entry.variety}-${entry.state}-${entry.district}-history`);
  const variance = entry.price * 0.18;
  return months.map((month, idx) => {
    const seasonal = Math.sin((idx / 11) * Math.PI * 2 + rand() * 3) * variance * 0.5;
    const noise = (rand() - 0.5) * variance;
    const price = Math.max(Math.round(entry.price + seasonal + noise), Math.round(entry.price * 0.6));
    return { month, price };
  });
}

function speak(text: string) {
  if ("speechSynthesis" in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    window.speechSynthesis.speak(utter);
  }
}

export default function MarketPrices({ setView }: MarketPricesProps) {
  const [state, setState] = useState("Karnataka");
  const [district, setDistrict] = useState("Bagalkote");
  const [category, setCategory] = useState<Category>("Vegetables");
  const [cropName, setCropName] = useState("Tomato");
  const [varietyFilter, setVarietyFilter] = useState<string>("All Varieties");

  const districts = stateDistricts[state] || [];

  useEffect(() => {
    if (!districts.includes(district)) {
      setDistrict(districts[0]);
    }
  }, [state, districts, district]);

  const categoryCrops = useMemo(
    () => cropCatalog.filter((c) => c.category === category),
    [category]
  );

  useEffect(() => {
    const exists = categoryCrops.some((c) => c.name === cropName);
    if (!exists) {
      setCropName(categoryCrops[0]?.name || "");
      setVarietyFilter("All Varieties");
    }
  }, [category, categoryCrops, cropName]);

  const currentCrop = useMemo(
    () => categoryCrops.find((c) => c.name === cropName) || categoryCrops[0],
    [categoryCrops, cropName]
  );

  const selectedVariety = useMemo(() => {
    if (!currentCrop) return "";
    return varietyFilter !== "All Varieties" && currentCrop.varieties.includes(varietyFilter)
      ? varietyFilter
      : currentCrop.varieties[0];
  }, [currentCrop, varietyFilter]);

  const currentEntry = useMemo(() => {
    if (!currentCrop) return null;
    return getEntry(currentCrop, selectedVariety, state, district);
  }, [currentCrop, selectedVariety, state, district]);

  const bestMarket = useMemo(() => {
    if (!currentCrop) return null;
    const ds = stateDistricts[state] || [];
    const entries = ds.map((d) => getEntry(currentCrop, selectedVariety, state, d));
    return entries.reduce((best, e) => (e.price > best.price ? e : best), entries[0]);
  }, [currentCrop, selectedVariety, state]);

  const tableEntries = useMemo(() => {
    const crops = cropName === "All" ? categoryCrops : categoryCrops.filter((c) => c.name === cropName);
    const rows = crops.flatMap((c) => c.varieties.map((v) => getEntry(c, v, state, district)));
    if (varietyFilter !== "All Varieties") {
      return rows.filter((r) => r.variety === varietyFilter);
    }
    return rows;
  }, [categoryCrops, cropName, state, district, varietyFilter]);

  const history = useMemo(() => (currentEntry ? generateHistory(currentEntry) : []), [currentEntry]);
  const historyStats = useMemo(() => {
    if (!history.length) return null;
    const prices = history.map((h) => h.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    };
  }, [history]);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      Vegetables: 0,
      Fruits: 0,
      Spices: 0,
      Cereals: 0,
      Pulses: 0,
      Oilseeds: 0,
      "Cash Crops": 0,
    };
    cropCatalog.forEach((c) => {
      counts[c.category] += c.varieties.length;
    });
    return counts;
  }, []);

  const varietyOptions = currentCrop ? ["All Varieties", ...currentCrop.varieties] : ["All Varieties"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => setView("dashboard")}
          className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="flex items-center gap-3 text-3xl font-bold text-gray-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <TrendingUp className="h-7 w-7" />
            </div>
            Market Prices
          </h2>
          <p className="mt-1 text-gray-500">
            Vegetables, Fruits, Spices, Cereals, Pulses, Oilseeds & Cash Crops — prices per kg
          </p>
        </div>

        {/* Category cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setCropName("All");
                  setVarietyFilter("All Varieties");
                }}
                className={`flex flex-col items-center rounded-2xl p-4 text-white shadow transition hover:scale-105 ${
                  active ? "ring-4 ring-white/60" : "opacity-90 hover:opacity-100"
                } ${cat.color}`}
              >
                <cat.icon className="mb-2 h-7 w-7" />
                <span className="font-semibold">{cat.id}</span>
                <span className="text-xs opacity-90">{categoryCounts[cat.id]} items</span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Select State</label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-gray-800 outline-none ring-green-200 transition focus:border-green-500 focus:ring"
              >
                {allStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Select District</label>
            <div className="relative">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-gray-800 outline-none ring-green-200 transition focus:border-green-500 focus:ring"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as Category);
                  setCropName("All");
                  setVarietyFilter("All Varieties");
                }}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-gray-800 outline-none ring-green-200 transition focus:border-green-500 focus:ring"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Select Crop</label>
            <div className="relative">
              <select
                value={cropName}
                onChange={(e) => {
                  setCropName(e.target.value);
                  setVarietyFilter("All Varieties");
                }}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-gray-800 outline-none ring-green-200 transition focus:border-green-500 focus:ring"
              >
                <option value="All">All {category}</option>
                {categoryCrops.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Select Variety</label>
            <div className="relative">
              <select
                value={varietyFilter}
                onChange={(e) => setVarietyFilter(e.target.value)}
                disabled={cropName === "All"}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-gray-800 outline-none ring-green-200 transition focus:border-green-500 focus:ring disabled:bg-gray-100 disabled:text-gray-400"
              >
                {varietyOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Varieties chips */}
        {currentCrop && (
          <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
              <Sprout className="h-5 w-5 text-green-600" />
              Varieties of {currentCrop.name} in India
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentCrop.varieties.map((v) => (
                <button
                  key={v}
                  onClick={() => setVarietyFilter(v)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    selectedVariety === v
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Select a variety for best-matching prices and regional suitability
            </p>
          </div>
        )}

        {/* Price card + best market */}
        {currentEntry && (
          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-lg lg:col-span-2">
              <div className="absolute -right-6 -top-6 opacity-10">
                <TrendingUp className="h-40 w-40" />
              </div>
              <div className="relative z-10">
                <p className="flex items-center gap-2 text-white/90">
                  <MapPin className="h-4 w-4" /> {currentEntry.district}, {currentEntry.state}
                </p>
                <p className="mt-2 text-lg font-medium text-white/90">
                  {currentEntry.crop} ({selectedVariety})
                </p>
                <p className="mt-2 text-6xl font-bold">₹{currentEntry.price}</p>
                <p className="text-white/90">per kilogram</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                      currentEntry.change >= 0 ? "bg-white/20" : "bg-black/10"
                    }`}
                  >
                    {currentEntry.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {currentEntry.change > 0 ? "+" : ""}
                    {currentEntry.change}% today
                  </span>
                  <span className="text-sm text-white/80">({currentEntry.market})</span>
                </div>
                <button
                  onClick={() =>
                    speak(
                      `${currentEntry.crop} ${selectedVariety} price in ${currentEntry.district}, ${currentEntry.state} is ₹${currentEntry.price} per kilogram.`
                    )
                  }
                  className="mt-5 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
                >
                  <Volume2 className="h-4 w-4" /> Voice Output
                </button>
              </div>
            </div>

            {bestMarket && (
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-800">
                  <Star className="h-5 w-5 text-amber-500" /> Best Market for {currentEntry.crop} in {state}
                </h3>
                <p className="text-lg font-semibold text-gray-800">
                  {currentEntry.crop} ({selectedVariety})
                </p>
                <p className="mt-1 text-3xl font-bold text-green-700">₹{bestMarket.price}/kg</p>
                <p className="text-sm text-gray-500">{bestMarket.market}</p>
                {bestMarket.district !== currentEntry.district && (
                  <p className="mt-3 text-sm text-gray-600">
                    Save ₹{Math.max(0, bestMarket.price - currentEntry.price)}/kg by selling here instead of{" "}
                    {currentEntry.district}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* History chart */}
        {currentEntry && (
          <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <TrendingUp className="h-5 w-5 text-green-600" />
                1-Year Price History: {currentEntry.crop} ({selectedVariety}) — {currentEntry.district}
              </h3>
              {historyStats && (
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">Min ₹{historyStats.min}</span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">Avg ₹{historyStats.avg}</span>
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-700">Max ₹{historyStats.max}</span>
                </div>
              )}
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => "₹" + v} />
                  <Tooltip
                    formatter={(value) => ["₹" + Number(value).toLocaleString(), "Price"]}
                    contentStyle={{ borderRadius: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#16a34a" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* All Prices table */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="mb-4 text-lg font-bold text-gray-800">
            All Prices in {state} • {category}
            {cropName !== "All" && ` • ${cropName}`}
            {varietyFilter !== "All Varieties" && ` • ${varietyFilter}`}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-green-50 text-green-800">
                <tr>
                  <th className="rounded-l-xl px-4 py-3 font-semibold">Crop</th>
                  <th className="px-4 py-3 font-semibold">Variety</th>
                  <th className="px-4 py-3 font-semibold">District</th>
                  <th className="px-4 py-3 font-semibold">Market</th>
                  <th className="px-4 py-3 font-semibold">Price (₹/kg)</th>
                  <th className="px-4 py-3 font-semibold">Change</th>
                  <th className="rounded-r-xl px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableEntries.map((entry, idx) => (
                  <tr
                    key={`${entry.crop}-${entry.variety}-${idx}`}
                    className="cursor-pointer border-b border-gray-50 transition hover:bg-green-50/50"
                    onClick={() => {
                      setCropName(entry.crop);
                      setVarietyFilter(entry.variety);
                    }}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{entry.crop}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.variety}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.district}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.market}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{entry.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`flex items-center gap-1 ${
                          entry.change >= 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {entry.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {entry.change > 0 ? "+" : ""}
                        {entry.change}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700">
                        <ShoppingCart className="h-3.5 w-3.5" /> Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tableEntries.length === 0 && (
            <div className="py-12 text-center text-gray-500">No prices found for the selected filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
