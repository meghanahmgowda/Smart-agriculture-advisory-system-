import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Loader2,
  CloudSun,
  CloudLightning,
  Snowflake,
  Navigation,
  Search,
} from "lucide-react";
import type { View } from "./Navbar";
import { stateDistricts } from "../data/districts";

interface WeatherProps {
  setView: (view: View) => void;
}

interface CurrentWeather {
  temp: number;
  humidity: number;
  wind: number;
  condition: string;
  code: number;
  rainChance: number;
}

interface DailyForecast {
  day: string;
  max: number;
  min: number;
  condition: string;
  code: number;
  rainChance: number;
}

interface Place {
  name: string;
  lat?: number;
  lon?: number;
}

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

const defaultLocation: Place = { name: "Nashik, Maharashtra", lat: 19.99, lon: 73.78 };

const majorCities: Place[] = [
  { name: "Nashik, Maharashtra", lat: 19.99, lon: 73.78 },
  { name: "Pune, Maharashtra", lat: 18.52, lon: 73.85 },
  { name: "Mumbai, Maharashtra", lat: 19.07, lon: 72.87 },
  { name: "Bengaluru, Karnataka", lat: 12.97, lon: 77.59 },
  { name: "Hyderabad, Telangana", lat: 17.38, lon: 78.48 },
  { name: "Chennai, Tamil Nadu", lat: 13.08, lon: 80.27 },
  { name: "Kolkata, West Bengal", lat: 22.57, lon: 88.36 },
  { name: "Delhi", lat: 28.61, lon: 77.2 },
  { name: "Lucknow, Uttar Pradesh", lat: 26.84, lon: 80.94 },
  { name: "Jaipur, Rajasthan", lat: 26.91, lon: 75.78 },
  { name: "Ahmedabad, Gujarat", lat: 23.02, lon: 72.57 },
  { name: "Ludhiana, Punjab", lat: 30.9, lon: 75.85 },
];

function getCondition(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 55) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

function getWeatherIcon(code: number) {
  if (code === 0) return Sun;
  if (code <= 3) return CloudSun;
  if (code <= 48) return Cloud;
  if (code <= 67) return CloudRain;
  if (code <= 77) return Snowflake;
  if (code <= 86) return CloudRain;
  if (code <= 99) return CloudLightning;
  return Cloud;
}

function formatDay(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { weekday: "short" });
}

export default function Weather({ setView }: WeatherProps) {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(defaultLocation.name);
  const [latLon, setLatLon] = useState<{ lat: number; lon: number } | null>(null);
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState(defaultLocation.name);
  const [showResults, setShowResults] = useState(false);

  const allPlaces = useMemo(() => {
    const list: Place[] = [...majorCities];
    Object.entries(stateDistricts).forEach(([state, districts]) => {
      districts.forEach((d) => {
        list.push({ name: `${d}, ${state}` });
      });
    });
    return list;
  }, []);

  const filteredPlaces = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return allPlaces
      .filter((p) => p.name.toLowerCase().startsWith(q))
      .slice(0, 10);
  }, [query, allPlaces]);

  const fetchWeather = useCallback(async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`
      );
      const data = await res.json();

      setCurrent({
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        wind: data.current.wind_speed_10m,
        condition: getCondition(data.current.weather_code),
        code: data.current.weather_code,
        rainChance: data.current.precipitation_probability ?? 0,
      });

      const daily: DailyForecast[] = data.daily.time.map((t: string, i: number) => ({
        day: i === 0 ? "Today" : formatDay(t),
        max: Math.round(data.daily.temperature_2m_max[i]),
        min: Math.round(data.daily.temperature_2m_min[i]),
        condition: getCondition(data.daily.weather_code[i]),
        code: data.daily.weather_code[i],
        rainChance: data.daily.precipitation_probability_max[i] ?? 0,
      }));
      setForecast(daily);
      setLocation(name);
      setQuery(name);
      setLatLon({ lat, lon });
    } catch {
      setError("Failed to load weather data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const geocodeAndFetch = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const searchName = name.split(",")[0];
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchName)}&count=10&language=en&format=json`
      );
      const data = await res.json();
      const place: GeoResult | undefined = (data.results || []).find(
        (r: GeoResult) => r.country === "India"
      );
      if (place) {
        fetchWeather(place.latitude, place.longitude, name);
      } else {
        setError(`Could not find coordinates for ${name}.`);
        setLoading(false);
      }
    } catch {
      setError("Geocoding failed. Please try another location.");
      setLoading(false);
    }
  }, [fetchWeather]);

  const selectPlace = useCallback(
    (place: Place) => {
      if (place.lat !== undefined && place.lon !== undefined) {
        fetchWeather(place.lat, place.lon, place.name);
      } else {
        geocodeAndFetch(place.name);
      }
    },
    [fetchWeather, geocodeAndFetch]
  );

  const detectLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser.");
      fetchWeather(defaultLocation.lat!, defaultLocation.lon!, defaultLocation.name);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const geo = await geoRes.json();
          const parts = [];
          if (geo.city) parts.push(geo.city);
          else if (geo.locality) parts.push(geo.locality);
          else if (geo.district) parts.push(geo.district);
          if (geo.principalSubdivision) parts.push(geo.principalSubdivision);
          const place = parts.join(", ") || "Your Location";
          fetchWeather(latitude, longitude, place);
        } catch {
          fetchWeather(latitude, longitude, "Your Location");
        }
      },
      (err) => {
        console.error(err);
        setError("Location access denied. Showing default location.");
        fetchWeather(defaultLocation.lat!, defaultLocation.lon!, defaultLocation.name);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [fetchWeather]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => setView("dashboard")}
          className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold text-green-800">Weather Forecast</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={detectLocation}
              className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-green-700"
            >
              <Navigation className="h-4 w-4" /> Use My Location
            </button>
            <div className="relative w-72">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 ring-green-200 transition focus-within:border-green-500 focus-within:ring">
                <MapPin className="h-4 w-4 text-green-600" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => query.trim() && setShowResults(true)}
                  placeholder="Search district / city in India..."
                  className="ml-2 w-full bg-transparent text-sm text-gray-800 outline-none"
                />
                <Search className="ml-2 h-4 w-4 text-gray-400" />
              </div>
              {showResults && (
                <div className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {filteredPlaces.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      {query.trim() ? "No matching place found. Try another name." : "Type to search places in India"}
                    </p>
                  ) : (
                    filteredPlaces.map((place, idx) => (
                      <button
                        key={`${place.name}-${idx}`}
                        onClick={() => selectPlace(place)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-green-50"
                      >
                        <MapPin className="h-3.5 w-3.5 text-green-600" />
                        <span className="truncate">{place.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl bg-yellow-50 p-3 text-sm text-yellow-800">{error}</div>}

        {loading && (
          <div className="flex h-64 items-center justify-center text-gray-500">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Detecting location & loading weather...
          </div>
        )}

        {!loading && current && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-800">
                <MapPin className="h-3.5 w-3.5" /> {location}
              </span>
              {latLon && (
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  Lat: {latLon.lat.toFixed(2)}, Lon: {latLon.lon.toFixed(2)}
                </span>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="col-span-2 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white shadow-lg md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-6xl font-bold">{current.temp}°C</h3>
                    <p className="mt-1 text-lg text-white/90">{current.condition}</p>
                  </div>
                  {(() => {
                    const Icon = getWeatherIcon(current.code);
                    return <Icon className="h-24 w-24 text-yellow-300" />;
                  })()}
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur-sm">
                    <Droplets className="mx-auto h-6 w-6" />
                    <p className="mt-1 text-sm">Humidity</p>
                    <p className="text-lg font-semibold">{current.humidity}%</p>
                  </div>
                  <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur-sm">
                    <Wind className="mx-auto h-6 w-6" />
                    <p className="mt-1 text-sm">Wind</p>
                    <p className="text-lg font-semibold">{current.wind} km/h</p>
                  </div>
                  <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur-sm">
                    <Thermometer className="mx-auto h-6 w-6" />
                    <p className="mt-1 text-sm">Feels like</p>
                    <p className="text-lg font-semibold">{current.temp + 2}°C</p>
                  </div>
                  <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur-sm">
                    <CloudRain className="mx-auto h-6 w-6" />
                    <p className="mt-1 text-sm">Rain chance</p>
                    <p className="text-lg font-semibold">{current.rainChance}%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h4 className="text-lg font-bold text-gray-800">Rain Alerts</h4>
                <p className="mt-2 text-gray-600">
                  {current.rainChance > 50
                    ? "High chance of rain. Keep harvested produce covered and avoid spraying chemicals."
                    : current.rainChance > 20
                    ? "Possibility of light rain. Monitor the sky before outdoor work."
                    : "No significant rain expected today. Good conditions for field work and irrigation."}
                </p>
                <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
                  Advisory: Plan irrigation based on the 7-day forecast below.
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h4 className="mb-4 text-lg font-bold text-gray-800">7-Day Forecast</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {forecast.map((day, idx) => {
                  const Icon = getWeatherIcon(day.code);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4 transition hover:bg-green-50"
                    >
                      <Icon className="h-10 w-10 text-blue-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{day.day}</p>
                        <p className="text-sm text-gray-500">{day.condition}</p>
                        <p className="text-sm font-medium text-gray-700">
                          {day.max}° / {day.min}°
                        </p>
                        <p className="text-xs text-blue-600">Rain: {day.rainChance}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
