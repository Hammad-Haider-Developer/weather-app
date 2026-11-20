# Skyline — Vue.js Weather App

A fully responsive weather application built with **Vue 3 (Options API)** and the free **[Open-Meteo](https://open-meteo.com/en/docs)** weather API. Search or select a city from a manually maintained list of 10 countries (5 cities each), view current conditions and a 7‑day forecast, and revisit your last 5 searches — all saved in `localStorage`.

## Features

- 📍 **50 manually maintained locations** — 10 countries × 5 cities each, with internal latitude/longitude (never shown in the UI).
- 🔎 **Search or select** — type to search across all cities/countries, or use the dependent Country → City dropdowns.
- 🌡️ **Current weather** — temperature, condition, feels‑like, humidity, and wind speed.
- 📅 **Interactive 7‑day forecast** — day label, condition icon, min/max temperature, and precipitation probability. Click/tap any day to expand a detail panel with feels‑like range, max wind, UV index, and sunrise/sunset.
- 🕘 **Search history** — last 5 searches persisted in `localStorage`, click any entry to reload that city's weather.
- ⏳ **Loading & error states** — a spinner while fetching, and a friendly retry prompt if the API call fails.
- 📱 **Fully responsive** — sidebar collapses above the main content on mobile; forecast scrolls horizontally on small screens.
- 🧩 **Reusable components** — `LocationPicker`, `CurrentWeatherCard`, `ForecastStrip`, `SearchHistory`.

## Tech stack

- [Vue 3](https://vuejs.org/) — **Options API** throughout (no Composition API/`<script setup>`)
- [Vite](https://vitejs.dev/) — dev server & build tool
- Plain CSS (scoped per component) — no UI framework
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs) — no API key required

## Project structure

```
weather-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js                    # Vue app entry point
│   ├── App.vue                    # Root component — layout & state orchestration
│   ├── assets/
│   │   └── main.css                # Design tokens / global styles
│   ├── components/
│   │   ├── LocationPicker.vue      # Search box + Country/City selects
│   │   ├── CurrentWeatherCard.vue  # Current conditions hero card
│   │   ├── ForecastStrip.vue       # 7-day forecast cards
│   │   └── SearchHistory.vue       # Last 5 searches (localStorage)
│   ├── data/
│   │   └── locations.js            # Manually maintained country/city/lat/lon list
│   └── utils/
│       └── weather.js              # Open-Meteo API call + WMO weather-code mapping
```

## Getting started

**Requirements:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open the printed local URL (default: http://localhost:5173)
```

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

The production-ready static files are output to `dist/`.

## How it works

1. **Select a location** — pick a country then a city, or type into the search box (matches city and country names).
2. The app looks up that location's **latitude/longitude** from the manually maintained list in `src/data/locations.js` — coordinates are only used internally, never sent as a name/query to the API and never displayed.
3. It calls the Open-Meteo `/v1/forecast` endpoint with those coordinates:
   ```
   https://api.open-meteo.com/v1/forecast
     ?latitude={lat}&longitude={lon}
     &current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m
     &daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,
            apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,uv_index_max,sunrise,sunset
     &timezone=auto&forecast_days=7
   ```
4. The **current weather card** and **7-day forecast strip** render from the response — weather codes are mapped to human-readable conditions and icons in `src/utils/weather.js` (following the WMO codes listed in the Open-Meteo docs).
5. The searched city/country is pushed to the front of **search history**, capped at 5 entries, and saved to `localStorage` so it survives refreshes. Only the city/country name is shown in the history list.

## Included locations

| Country | Cities |
|---|---|
| Pakistan | Lahore, Karachi, Islamabad, Peshawar, Multan |
| India | Delhi, Mumbai, Bangalore, Kolkata, Chennai |
| China | Beijing, Shanghai, Guangzhou, Shenzhen, Chengdu |
| France | Paris, Marseille, Lyon, Toulouse, Nice |
| Germany | Berlin, Munich, Hamburg, Frankfurt, Cologne |
| Bangladesh | Dhaka, Chittagong, Khulna, Rajshahi, Sylhet |
| Russia | Moscow, Saint Petersburg, Novosibirsk, Yekaterinburg, Kazan |
| Sri Lanka | Colombo, Kandy, Galle, Jaffna, Negombo |
| Iran | Tehran, Mashhad, Isfahan, Shiraz, Tabriz |
| Australia | Sydney, Melbourne, Brisbane, Perth, Adelaide |

Want to add more? Just append `{ country, city, latitude, longitude }` entries to `src/data/locations.js` — everything else (dropdowns, search, history) picks them up automatically.

## Notes

- No API key is required — Open-Meteo's forecast endpoint is free for non-commercial use.
- All data comes live from Open-Meteo; nothing is hard-coded.
