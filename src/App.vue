<template>
  <div class="app">
    <header class="app__header">
      <div class="app__brand">
        <span class="app__brand-icon" aria-hidden="true">🌤️</span>
        <div>
          <h1 class="app__title">Forecastly</h1>
          <p class="app__subtitle">Live weather for cities around the world</p>
        </div>
      </div>
    </header>

    <main class="app__layout">
      <aside class="app__sidebar">
        <div class="panel">
          <LocationPicker
            ref="picker"
            :locations="locations"
            @select="handleSelect"
          />
        </div>
        <div class="panel">
          <SearchHistory
            :items="history"
            :active-location="selectedLocation"
            @select="handleSelect"
            @clear="clearHistory"
          />
        </div>
      </aside>

      <section class="app__main">
        <CurrentWeatherCard
          :weather="weather"
          :location="selectedLocation"
          :loading="loading"
          :error="error"
          @retry="retry"
        />
        <ForecastStrip :days="forecastDays" />
      </section>
    </main>

    <footer class="app__footer">
      Weather data provided by
      <a href="https://open-meteo.com/" target="_blank" rel="noopener"
        >Open-Meteo</a
      >
    </footer>
  </div>
</template>

<script>
import LocationPicker from "./components/LocationPicker.vue";
import CurrentWeatherCard from "./components/CurrentWeatherCard.vue";
import ForecastStrip from "./components/ForecastStrip.vue";
import SearchHistory from "./components/SearchHistory.vue";
import { LOCATIONS } from "./data/locations.js";
import {
  fetchWeather,
  getWeatherInfo,
  formatDayLabel,
  formatClockTime,
} from "./utils/weather.js";

const HISTORY_KEY = "skyline-weather-history";
const MAX_HISTORY = 5;

export default {
  name: "App",
  components: {
    LocationPicker,
    CurrentWeatherCard,
    ForecastStrip,
    SearchHistory,
  },
  data() {
    return {
      locations: LOCATIONS,
      selectedLocation: null,
      weather: null,
      loading: false,
      error: "",
      history: [],
    };
  },
  computed: {
    forecastDays() {
      if (!this.weather || !this.weather.daily) return [];
      const {
        time,
        weather_code,
        temperature_2m_max,
        temperature_2m_min,
        precipitation_probability_max,
        apparent_temperature_max,
        apparent_temperature_min,
        wind_speed_10m_max,
        uv_index_max,
        sunrise,
        sunset,
      } = this.weather.daily;
      return time.map((date, index) => {
        const info = getWeatherInfo(weather_code[index]);
        return {
          date,
          label: formatDayLabel(date, index),
          icon: info.icon,
          condition: info.label,
          max: Math.round(temperature_2m_max[index]),
          min: Math.round(temperature_2m_min[index]),
          precipitation: Math.round(precipitation_probability_max[index] ?? 0),
          feelsMax: apparent_temperature_max
            ? Math.round(apparent_temperature_max[index])
            : null,
          feelsMin: apparent_temperature_min
            ? Math.round(apparent_temperature_min[index])
            : null,
          windMax: wind_speed_10m_max
            ? Math.round(wind_speed_10m_max[index])
            : null,
          uvMax: uv_index_max ? Math.round(uv_index_max[index]) : null,
          sunrise: sunrise ? formatClockTime(sunrise[index]) : null,
          sunset: sunset ? formatClockTime(sunset[index]) : null,
        };
      });
    },
  },
  created() {
    this.loadHistory();
  },
  mounted() {
    if (this.history.length) {
      this.selectLocation(this.history[0]);
    }
  },
  methods: {
    async handleSelect(location) {
      await this.selectLocation(location);
    },
    async selectLocation(location) {
      this.selectedLocation = location;
      this.loading = true;
      this.error = "";
      this.weather = null;

      if (this.$refs.picker) {
        this.$refs.picker.setSelection(location);
      }

      try {
        const data = await fetchWeather(location.latitude, location.longitude);
        this.weather = data;
        this.addToHistory(location);
      } catch (err) {
        this.error =
          err.message || "Something went wrong while fetching the weather.";
      } finally {
        this.loading = false;
      }
    },
    retry() {
      if (this.selectedLocation) {
        this.selectLocation(this.selectedLocation);
      }
    },
    loadHistory() {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        this.history = raw ? JSON.parse(raw) : [];
      } catch {
        this.history = [];
      }
    },
    persistHistory() {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
      } catch {
        /* localStorage unavailable — history just won't persist */
      }
    },
    addToHistory(location) {
      const entry = {
        city: location.city,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      const withoutDuplicate = this.history.filter(
        (item) => !(item.city === entry.city && item.country === entry.country),
      );
      this.history = [entry, ...withoutDuplicate].slice(0, MAX_HISTORY);
      this.persistHistory();
    },
    clearHistory() {
      this.history = [];
      this.persistHistory();
    },
  },
};
</script>

<style scoped>
.app {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 20px 60px;
}

.app__header {
  margin-bottom: 26px;
}

.app__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.app__brand-icon {
  font-size: 34px;
}

.app__title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
}

.app__subtitle {
  margin: 2px 0 0;
  font-size: 13.5px;
  color: var(--text-muted);
}

.app__layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
}

.app__sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 20px;
}

.panel {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.app__main {
  min-width: 0;
}

.app__footer {
  margin-top: 40px;
  text-align: center;
  font-size: 12.5px;
  color: var(--text-faint);
}

.app__footer a {
  color: var(--teal);
  text-decoration: none;
}

.app__footer a:hover {
  text-decoration: underline;
}

@media (max-width: 860px) {
  .app__layout {
    grid-template-columns: 1fr;
  }
  .app__sidebar {
    position: static;
  }
}
</style>
