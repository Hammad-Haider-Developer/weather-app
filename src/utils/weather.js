// Maps Open-Meteo / WMO weather codes to a label + icon.
// Reference: https://open-meteo.com/en/docs (Weather variable documentation)
const WEATHER_CODES = {
  0: { label: "Clear Sky", icon: "☀️" },
  1: { label: "Mainly Clear", icon: "🌤️" },
  2: { label: "Partly Cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Depositing Rime Fog", icon: "🌫️" },
  51: { label: "Light Drizzle", icon: "🌦️" },
  53: { label: "Moderate Drizzle", icon: "🌦️" },
  55: { label: "Dense Drizzle", icon: "🌧️" },
  56: { label: "Light Freezing Drizzle", icon: "🌧️" },
  57: { label: "Dense Freezing Drizzle", icon: "🌧️" },
  61: { label: "Slight Rain", icon: "🌧️" },
  63: { label: "Moderate Rain", icon: "🌧️" },
  65: { label: "Heavy Rain", icon: "🌧️" },
  66: { label: "Light Freezing Rain", icon: "🌨️" },
  67: { label: "Heavy Freezing Rain", icon: "🌨️" },
  71: { label: "Slight Snow Fall", icon: "🌨️" },
  73: { label: "Moderate Snow Fall", icon: "🌨️" },
  75: { label: "Heavy Snow Fall", icon: "❄️" },
  77: { label: "Snow Grains", icon: "❄️" },
  80: { label: "Slight Rain Showers", icon: "🌦️" },
  81: { label: "Moderate Rain Showers", icon: "🌧️" },
  82: { label: "Violent Rain Showers", icon: "⛈️" },
  85: { label: "Slight Snow Showers", icon: "🌨️" },
  86: { label: "Heavy Snow Showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm w/ Slight Hail", icon: "⛈️" },
  99: { label: "Thunderstorm w/ Heavy Hail", icon: "⛈️" },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: "Unknown", icon: "❔" };
}

const API_BASE = "https://api.open-meteo.com/v1/forecast";

/**
 * Fetches current conditions + a 7 day daily forecast for a coordinate pair.
 * Only latitude/longitude are sent to the API — never the city/country name.
 */
export async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "wind_speed_10m_max",
      "uv_index_max",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "auto",
    forecast_days: 7,
  });

  const response = await fetch(`${API_BASE}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Weather service is unavailable right now.");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.reason || "Could not load weather for this location.");
  }

  return data;
}

export function formatClockTime(isoStr) {
  if (!isoStr) return "--";
  const date = new Date(isoStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDayLabel(dateStr, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long" });
}
