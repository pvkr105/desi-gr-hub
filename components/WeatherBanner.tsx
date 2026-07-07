"use client";

import { useEffect, useState } from "react";

// Live Grand Rapids weather via Open-Meteo (free, no API key, CORS-enabled).
// Client island: the HTML is static, only the numbers hydrate on mount.
const GR = { lat: 42.9634, lon: -85.6681 };
const URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${GR.lat}&longitude=${GR.lon}` +
  `&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`;

type Weather = { temp: number; feels: number; code: number };

// ponytail: trimmed WMO weather-code subset, enough for a banner. Expand if a
// missing code ever shows an empty label.
function describe(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: "Clear", emoji: "☀️" };
  if (code <= 3) return { label: "Partly cloudy", emoji: "⛅" };
  if (code <= 48) return { label: "Foggy", emoji: "🌫️" };
  if (code <= 67) return { label: "Rainy", emoji: "🌧️" };
  if (code <= 77) return { label: "Snow", emoji: "❄️" };
  if (code <= 82) return { label: "Rain showers", emoji: "🌦️" };
  if (code <= 86) return { label: "Snow showers", emoji: "🌨️" };
  return { label: "Thunderstorm", emoji: "⛈️" };
}

const isSnow = (c: number) => (c >= 71 && c <= 77) || (c >= 85 && c <= 86);

export function WeatherBanner() {
  const [w, setW] = useState<Weather | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch(URL)
      .then((r) => r.json())
      .then((d) => {
        const c = d?.current;
        if (typeof c?.temperature_2m === "number") {
          if (sessionStorage.getItem("gr-weather-dismissed")) setDismissed(true);
          setW({ temp: c.temperature_2m, feels: c.apparent_temperature, code: c.weather_code });
        }
      })
      .catch(() => {}); // silent, no layout noise on failure
  }, []);

  if (!w) return null;

  const { label, emoji } = describe(w.code);
  const alert = w.feels <= 20 || isSnow(w.code);

  if (alert && !dismissed) {
    const msg = isSnow(w.code)
      ? "Snow in Grand Rapids, drive slow and dress warm."
      : `Feels like ${Math.round(w.feels)}°F, bundle up if you're heading out.`;
    return (
      <div className="glass mb-4 flex items-center gap-3 rounded-2xl border-saffron/60 p-3 text-sm">
        <span className="text-lg" aria-hidden>
          {emoji}
        </span>
        <span className="flex-1">
          <span className="font-semibold text-saffron">Winter weather alert · </span>
          {msg} Currently {Math.round(w.temp)}°F in GR.
        </span>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            sessionStorage.setItem("gr-weather-dismissed", "1");
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Dismiss weather alert"
        >
          ✕
        </button>
      </div>
    );
  }

  // Slim always-on chip.
  return (
    <div className="mb-4 flex justify-end">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted">
        <span aria-hidden>{emoji}</span>
        Grand Rapids {Math.round(w.temp)}°F · {label}
      </span>
    </div>
  );
}
