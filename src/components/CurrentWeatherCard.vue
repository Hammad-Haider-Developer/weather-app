<template>
  <section class="hero" :class="moodClass">
    <div class="hero__glow" aria-hidden="true"></div>

    <template v-if="loading">
      <div class="hero__state">
        <div class="spinner" aria-hidden="true"></div>
        <p>Fetching live weather…</p>
      </div>
    </template>

    <template v-else-if="error">
      <div class="hero__state hero__state--error">
        <div class="hero__error-icon" aria-hidden="true">⚠️</div>
        <p class="hero__error-title">Couldn't load the weather</p>
        <p class="hero__error-message">{{ error }}</p>
        <button class="hero__retry" type="button" @click="$emit('retry')">Try again</button>
      </div>
    </template>

    <template v-else-if="weather">
      <div class="hero__top">
        <div>
          <p class="hero__place">{{ location.city }}, {{ location.country }}</p>
          <p class="hero__updated">Updated {{ updatedTime }}</p>
        </div>
        <div class="hero__icon" aria-hidden="true">{{ conditionIcon }}</div>
      </div>

      <div class="hero__main">
        <span class="hero__temp">{{ roundedTemp }}°<span class="hero__unit">C</span></span>
        <span class="hero__condition">{{ conditionLabel }}</span>
      </div>

      <div class="hero__stats">
        <div class="hero__stat">
          <span class="hero__stat-label">Feels Like</span>
          <span class="hero__stat-value">{{ Math.round(weather.current.apparent_temperature) }}°C</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-label">Humidity</span>
          <span class="hero__stat-value">{{ Math.round(weather.current.relative_humidity_2m) }}%</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-label">Wind</span>
          <span class="hero__stat-value">{{ Math.round(weather.current.wind_speed_10m) }} km/h</span>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="hero__state hero__state--empty">
        <div class="hero__empty-icon" aria-hidden="true">🧭</div>
        <p class="hero__empty-title">Choose a city to begin</p>
        <p class="hero__empty-message">Search or pick a country and city to see live conditions.</p>
      </div>
    </template>
  </section>
</template>

<script>
import { getWeatherInfo } from '../utils/weather.js'

export default {
  name: 'CurrentWeatherCard',
  props: {
    weather: { type: Object, default: null },
    location: { type: Object, default: null },
    loading: { type: Boolean, default: false },
    error: { type: String, default: '' },
  },
  emits: ['retry'],
  computed: {
    conditionInfo() {
      if (!this.weather) return null
      return getWeatherInfo(this.weather.current.weather_code)
    },
    conditionIcon() {
      return this.conditionInfo ? this.conditionInfo.icon : '🌡️'
    },
    conditionLabel() {
      return this.conditionInfo ? this.conditionInfo.label : ''
    },
    roundedTemp() {
      return this.weather ? Math.round(this.weather.current.temperature_2m) : '--'
    },
    updatedTime() {
      if (!this.weather) return ''
      const date = new Date(this.weather.current.time)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    moodClass() {
      const code = this.weather ? this.weather.current.weather_code : null
      if (code === null || code === undefined) return 'hero--neutral'
      if (code === 0 || code === 1) return 'hero--clear'
      if ([2, 3, 45, 48].includes(code)) return 'hero--cloudy'
      if ([61, 63, 65, 80, 81, 82, 51, 53, 55, 56, 57, 66, 67].includes(code)) return 'hero--rain'
      if ([71, 73, 75, 77, 85, 86].includes(code)) return 'hero--snow'
      if ([95, 96, 99].includes(code)) return 'hero--storm'
      return 'hero--neutral'
    },
  },
}
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  background: var(--surface);
  padding: 32px clamp(20px, 4vw, 40px);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero__glow {
  position: absolute;
  inset: -40% -10% auto auto;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.35;
  background: var(--accent);
  pointer-events: none;
}

.hero--clear .hero__glow { background: #f6ac48; }
.hero--cloudy .hero__glow { background: #7c94b3; }
.hero--rain .hero__glow { background: #5fd0c0; }
.hero--snow .hero__glow { background: #c9e6ff; }
.hero--storm .hero__glow { background: #9d7bea; }

.hero__top {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.hero__place {
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 26px);
  font-weight: 700;
  margin: 0 0 4px;
}

.hero__updated {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}

.hero__icon {
  font-size: clamp(44px, 6vw, 64px);
  line-height: 1;
  filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.35));
}

.hero__main {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin: 22px 0 26px;
  flex-wrap: wrap;
}

.hero__temp {
  font-family: var(--font-display);
  font-size: clamp(56px, 9vw, 88px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}

.hero__unit {
  font-size: 0.45em;
  font-weight: 600;
  color: var(--text-muted);
}

.hero__condition {
  font-size: clamp(16px, 2vw, 19px);
  font-weight: 500;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.08);
  padding: 8px 16px;
  border-radius: 100px;
  border: 1px solid var(--surface-border);
}

.hero__stats {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.hero__stat {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero__stat-label {
  font-size: 12px;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.hero__stat-value {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
}

.hero__state {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  color: var(--text-muted);
  padding: 30px 10px;
}

.hero__state p {
  margin: 0;
}

.spinner {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.hero__error-icon,
.hero__empty-icon {
  font-size: 36px;
}

.hero__error-title,
.hero__empty-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.hero__error-message,
.hero__empty-message {
  font-size: 14px;
  max-width: 320px;
}

.hero__retry {
  margin-top: 6px;
  background: var(--accent);
  color: #201203;
  border: none;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 100px;
}

.hero__retry:hover {
  filter: brightness(1.07);
}

@media (max-width: 520px) {
  .hero__stats {
    grid-template-columns: 1fr 1fr;
  }
  .hero__stats .hero__stat:last-child {
    grid-column: 1 / -1;
  }
}
</style>
