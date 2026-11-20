<template>
  <section class="forecast" v-if="days.length">
    <h2 class="forecast__title">7-Day Forecast</h2>
    <div class="forecast__scroller">
      <button
        v-for="(day, index) in days"
        :key="day.date"
        type="button"
        class="forecast__day"
        :class="{ 'forecast__day--today': index === 0, 'forecast__day--active': selectedIndex === index }"
        :aria-expanded="selectedIndex === index"
        @click="toggleDay(index)"
      >
        <p class="forecast__day-label">{{ day.label }}</p>
        <p class="forecast__day-icon" aria-hidden="true">{{ day.icon }}</p>
        <p class="forecast__day-condition">{{ day.condition }}</p>
        <div class="forecast__temps">
          <span class="forecast__temp-max">{{ day.max }}°</span>
          <span class="forecast__temp-min">{{ day.min }}°</span>
        </div>
        <div class="forecast__precip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13Z" stroke="currentColor" stroke-width="1.8" />
          </svg>
          {{ day.precipitation }}%
        </div>
        <span class="forecast__day-hint">{{ selectedIndex === index ? 'Hide details' : 'Tap for details' }}</span>
      </button>
    </div>

    <transition name="detail">
      <div v-if="selectedDay" class="forecast__detail">
        <div class="forecast__detail-head">
          <span class="forecast__detail-icon" aria-hidden="true">{{ selectedDay.icon }}</span>
          <div>
            <p class="forecast__detail-title">{{ selectedDay.label }} · {{ selectedDay.condition }}</p>
            <p class="forecast__detail-sub">High {{ selectedDay.max }}° · Low {{ selectedDay.min }}°</p>
          </div>
          <button type="button" class="forecast__detail-close" aria-label="Close details" @click="selectedIndex = null">✕</button>
        </div>
        <div class="forecast__detail-grid">
          <div class="forecast__detail-stat">
            <span class="forecast__detail-label">Feels Like</span>
            <span class="forecast__detail-value">
              {{ selectedDay.feelsMin ?? '--' }}° / {{ selectedDay.feelsMax ?? '--' }}°
            </span>
          </div>
          <div class="forecast__detail-stat">
            <span class="forecast__detail-label">Max Wind</span>
            <span class="forecast__detail-value">{{ selectedDay.windMax ?? '--' }} km/h</span>
          </div>
          <div class="forecast__detail-stat">
            <span class="forecast__detail-label">UV Index</span>
            <span class="forecast__detail-value">{{ selectedDay.uvMax ?? '--' }}</span>
          </div>
          <div class="forecast__detail-stat">
            <span class="forecast__detail-label">Rain Chance</span>
            <span class="forecast__detail-value">{{ selectedDay.precipitation }}%</span>
          </div>
          <div class="forecast__detail-stat">
            <span class="forecast__detail-label">Sunrise</span>
            <span class="forecast__detail-value">{{ selectedDay.sunrise ?? '--' }}</span>
          </div>
          <div class="forecast__detail-stat">
            <span class="forecast__detail-label">Sunset</span>
            <span class="forecast__detail-value">{{ selectedDay.sunset ?? '--' }}</span>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'ForecastStrip',
  props: {
    days: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedIndex: null,
    }
  },
  computed: {
    selectedDay() {
      return this.selectedIndex === null ? null : this.days[this.selectedIndex]
    },
  },
  watch: {
    // Reset the open detail panel whenever a new location's forecast arrives.
    days() {
      this.selectedIndex = null
    },
  },
  methods: {
    toggleDay(index) {
      this.selectedIndex = this.selectedIndex === index ? null : index
    },
  },
}
</script>

<style scoped>
.forecast {
  margin-top: 22px;
}

.forecast__title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0 0 12px;
}

.forecast__scroller {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(122px, 1fr);
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scroll-snap-type: x proximity;
}

.forecast__day {
  scroll-snap-align: start;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
  font-family: inherit;
}

.forecast__day:hover {
  transform: translateY(-3px);
  background: var(--surface-hover);
}

.forecast__day--today {
  border-color: rgba(246, 172, 72, 0.45);
  background: var(--accent-soft);
}

.forecast__day--active {
  border-color: var(--teal);
  background: var(--teal-soft);
  transform: translateY(-3px);
}

.forecast__day-label {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.forecast__day-icon {
  margin: 2px 0;
  font-size: 28px;
  line-height: 1;
}

.forecast__day-condition {
  margin: 0;
  font-size: 11px;
  color: var(--text-muted);
  min-height: 28px;
  line-height: 1.3;
}

.forecast__temps {
  display: flex;
  gap: 8px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
}

.forecast__temp-min {
  color: var(--text-faint);
  font-weight: 500;
}

.forecast__precip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--teal);
}

.forecast__day-hint {
  margin-top: 2px;
  font-size: 10px;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.forecast__detail {
  margin-top: 14px;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 18px 20px;
}

.forecast__detail-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.forecast__detail-icon {
  font-size: 32px;
}

.forecast__detail-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15.5px;
}

.forecast__detail-sub {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: var(--text-muted);
}

.forecast__detail-close {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--text-faint);
  font-size: 14px;
  padding: 6px;
}

.forecast__detail-close:hover {
  color: var(--text-primary);
}

.forecast__detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 10px;
}

.forecast__detail-stat {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.forecast__detail-label {
  font-size: 11px;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.forecast__detail-value {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
}

.detail-enter-active,
.detail-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
