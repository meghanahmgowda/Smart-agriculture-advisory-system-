import { useEffect, useState } from "react";
import Login from "./components/Login";
import Navbar, { type View } from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Weather from "./components/Weather";
import AIAdvisory from "./components/AIAdvisory";
import DiseaseIdentifier from "./components/DiseaseIdentifier";
import CropSelection from "./components/CropSelection";
import MarketPrices from "./components/MarketPrices";
import IoTHardware from "./components/IoTHardware";

interface User {
  name: string;
  phone: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>("dashboard");

  useEffect(() => {
    const saved = localStorage.getItem("smartAgriUser");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("smartAgriUser");
      }
    }
  }, []);

  const handleLogin = (name: string, phone: string) => {
    const newUser = { name, phone };
    setUser(newUser);
    localStorage.setItem("smartAgriUser", JSON.stringify(newUser));
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("smartAgriUser");
    setView("dashboard");
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar view={view} setView={setView} userName={user.name} onLogout={handleLogout} />
      {view === "dashboard" && <Dashboard userName={user.name} setView={setView} />}
      {view === "weather" && <Weather setView={setView} />}
      {view === "advisory" && <AIAdvisory userName={user.name} setView={setView} />}
      {view === "disease" && <DiseaseIdentifier setView={setView} />}
      {view === "crop" && <CropSelection setView={setView} />}
      {view === "market" && <MarketPrices setView={setView} />}
      {view === "iot" && <IoTHardware setView={setView} />}
    </div>
  );
}
