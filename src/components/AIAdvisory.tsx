import { useState } from "react";
import { ArrowLeft, Sparkles, Send, Volume2, Loader2 } from "lucide-react";
import type { View } from "./Navbar";

interface AIAdvisoryProps {
  userName: string;
  setView: (view: View) => void;
}

const suggestions = [
  "What crops should I grow this season?",
  "How can I improve soil fertility?",
  "Best irrigation schedule for tomatoes",
  "Organic pest control for cotton",
];

const responses: Record<string, string> = {
  "What crops should I grow this season?":
    "Based on the current climate and soil conditions, you can grow cotton, soybean, or maize this season. Cotton is profitable if irrigation is available; soybean improves soil nitrogen.",
  "How can I improve soil fertility?":
    "Add organic compost, practice crop rotation with legumes, and test soil NPK levels. Use green manure like dhaincha before the main crop.",
  "Best irrigation schedule for tomatoes":
    "Tomatoes need consistent moisture. Irrigate early morning, 2-3 times per week depending on weather. Avoid wetting foliage to reduce disease.",
  "Organic pest control for cotton":
    "Use neem-based sprays, release Trichogramma parasitoids, and install pheromone traps for bollworms. Intercrop with marigold to attract beneficial insects.",
};

function speak(text: string) {
  if ("speechSynthesis" in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    window.speechSynthesis.speak(utter);
  }
}

export default function AIAdvisory({ userName, setView }: AIAdvisoryProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(
    `Hello ${userName}, I am your AI farming assistant. Ask me anything about crops, weather, pests, or soil.`
  );

  const ask = (text: string) => {
    setQuery(text);
    setLoading(true);
    setTimeout(() => {
      setAnswer(responses[text] || `That's a great question about "${text}". I recommend consulting local agronomists while we keep learning from your farm data.`);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => setView("dashboard")}
          className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-green-800">
          <Sparkles className="h-8 w-8 text-purple-500" /> AI Advisory
        </h2>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
          <div className="mb-6 flex items-start gap-4 rounded-2xl bg-green-50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-green-800">AI Advisor</p>
              <p className="mt-1 text-gray-700">{answer}</p>
              <button
                onClick={() => speak(answer)}
                className="mt-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-green-700 shadow-sm"
              >
                <Volume2 className="h-3.5 w-3.5" /> Listen
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-green-200 bg-white px-4 py-2 text-sm text-green-700 transition hover:bg-green-50"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) ask(query.trim());
            }}
            className="flex gap-2"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your farming question..."
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none ring-green-200 transition focus:border-green-500 focus:ring"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white shadow transition hover:bg-green-700 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
