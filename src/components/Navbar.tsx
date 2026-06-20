import { useState } from "react";
import {
  Sprout,
  LayoutDashboard,
  Cloud,
  Sparkles,
  Bug,
  Leaf,
  TrendingUp,
  Cpu,
  Globe,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export type View =
  | "dashboard"
  | "weather"
  | "advisory"
  | "disease"
  | "crop"
  | "market"
  | "iot";

interface NavbarProps {
  view: View;
  setView: (view: View) => void;
  userName: string;
  onLogout: () => void;
}

const links: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "weather", label: "Weather", icon: Cloud },
  { id: "advisory", label: "AI Advisory", icon: Sparkles },
  { id: "disease", label: "Disease Identifier", icon: Bug },
  { id: "crop", label: "Crop Selection", icon: Leaf },
  { id: "market", label: "Market Prices", icon: TrendingUp },
  { id: "iot", label: "IoT Hardware", icon: Cpu },
];

export default function Navbar({ view, setView, userName, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-700 to-emerald-700 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-white">Smart Agri</h1>
            <p className="text-xs text-white/80">AI-Powered Agriculture Advisory</p>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = view === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setView(link.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-white text-green-700 shadow"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <Globe className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white">
            <User className="h-4 w-4" />
            {userName}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white shadow transition hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white lg:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-green-800 px-4 py-3 lg:hidden">
          <div className="grid gap-2">
            {links.map((link) => {
              const active = view === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setView(link.id);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                    active ? "bg-white text-green-700" : "text-white hover:bg-white/10"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-2 text-sm text-white">
              <User className="h-4 w-4" /> {userName}
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
