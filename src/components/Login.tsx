import { useState } from "react";
import { Sprout, User, Lock, Phone, Mic, ArrowRight } from "lucide-react";

interface LoginProps {
  onLogin: (name: string, phone: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [tab, setTab] = useState<"farmer" | "admin">("farmer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    onLogin(username, phone);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-700 via-emerald-600 to-lime-500 px-4 py-12">
      {/* Decorative leaves */}
      <div className="pointer-events-none absolute -left-16 top-24 opacity-20">
        <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor" className="text-green-100">
          <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z" />
        </svg>
      </div>
      <div className="pointer-events-none absolute -right-20 bottom-12 opacity-15">
        <svg width="360" height="360" viewBox="0 0 24 24" fill="currentColor" className="text-green-100">
          <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Sprout className="h-10 w-10 text-green-700" />
          </div>
          <h1 className="text-3xl font-bold text-green-800">Smart Agri</h1>
          <p className="text-green-600">AI-Powered Agriculture Advisory</p>
        </div>

        <div className="mb-6 flex rounded-xl bg-green-50 p-1">
          <button
            type="button"
            onClick={() => setTab("farmer")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "farmer" ? "bg-green-600 text-white shadow" : "text-green-700 hover:bg-green-100"
            }`}
          >
            <User className="h-4 w-4" /> Farmer Login
          </button>
          <button
            type="button"
            onClick={() => setTab("admin")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "admin" ? "bg-green-600 text-white shadow" : "text-green-700 hover:bg-green-100"
            }`}
          >
            <Lock className="h-4 w-4" /> Admin Login
          </button>
        </div>

        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
          <span className="font-semibold">Demo:</span> Use any username with any password (4+ chars) and any 10-digit phone. New users auto-registered.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-12 text-gray-800 outline-none ring-green-200 transition focus:border-green-500 focus:ring"
            />
            <Mic className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-12 text-gray-800 outline-none ring-green-200 transition focus:border-green-500 focus:ring"
            />
            <Mic className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Phone Number"
              maxLength={10}
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-12 text-gray-800 outline-none ring-green-200 transition focus:border-green-500 focus:ring"
            />
            <Mic className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-semibold text-white shadow-lg transition hover:from-green-700 hover:to-emerald-700"
          >
            <ArrowRight className="h-5 w-5" /> Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-green-700">
          New user?{" "}
          <button type="button" className="font-semibold underline hover:text-green-900">
            Register here
          </button>
        </p>
      </div>

      <p className="absolute bottom-4 w-full text-center text-sm text-white/80">
        🌾 Empowering farmers with AI, IoT & Voice Technology
      </p>
    </div>
  );
}
