<template>
  <div class="picker">
    <h2 class="picker__title">Find a place</h2>

    <div class="picker__search">
      <svg
        class="picker__search-icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
        <path
          d="M20 20L16.5 16.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <input
        v-model="query"
        type="text"
        placeholder="Search city or country…"
        class="picker__search-input"
        @focus="showSuggestions = true"
      />
      <button
        v-if="query"
        class="picker__clear"
        type="button"
        aria-label="Clear search"
        @click="query = ''"
      >
        ✕
      </button>

      <ul
        v-if="showSuggestions && query && filteredResults.length"
        class="picker__suggestions"
      >
        <li v-for="loc in filteredResults" :key="loc.city + loc.country">
          <button type="button" class="picker__suggestion" @click="choose(loc)">
            <span class="picker__suggestion-city">{{ loc.city }}</span>
            <span class="picker__suggestion-country">{{ loc.country }}</span>
          </button>
        </li>
      </ul>
      <div
        v-else-if="showSuggestions && query && !filteredResults.length"
        class="picker__no-results"
      >
        No matching city or country.
      </div>
    </div>

    <div class="picker__row">
      <label class="picker__field">
        <span class="picker__label">Country</span>
        <select
          v-model="selectedCountry"
          class="picker__select"
          @change="selectedCity = ''"
        >
          <option value="" disabled>Choose a country</option>
          <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>

      <label class="picker__field">
        <span class="picker__label">City</span>
        <select
          v-model="selectedCity"
          class="picker__select"
          :disabled="!selectedCountry"
          @change="onCityChange"
        >
          <option value="" disabled>
            {{ selectedCountry ? "Choose a city" : "Select a country first" }}
          </option>
          <option v-for="c in citiesForCountry" :key="c.city" :value="c.city">
            {{ c.city }}
          </option>
        </select>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "LocationPicker",
  props: {
    locations: {
      type: Array,
      required: true,
    },
  },
  emits: ["select"],
  data() {
    return {
      query: "",
      selectedCountry: "",
      selectedCity: "",
      showSuggestions: false,
    };
  },
  computed: {
    countries() {
      const set = new Set(this.locations.map((l) => l.country));
      return Array.from(set).sort();
    },
    citiesForCountry() {
      if (!this.selectedCountry) return [];
      return this.locations
        .filter((l) => l.country === this.selectedCountry)
        .sort((a, b) => a.city.localeCompare(b.city));
    },
    filteredResults() {
      const q = this.query.trim().toLowerCase();
      if (!q) return [];
      return this.locations
        .filter(
          (l) =>
            l.city.toLowerCase().includes(q) ||
            l.country.toLowerCase().includes(q),
        )
        .slice(0, 8);
    },
  },
  mounted() {
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
  methods: {
    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.showSuggestions = false;
      }
    },
    choose(location) {
      this.selectedCountry = location.country;
      this.selectedCity = location.city;
      this.query = "";
      this.showSuggestions = false;
      this.$emit("select", location);
    },
    onCityChange() {
      const loc = this.locations.find(
        (l) =>
          l.country === this.selectedCountry && l.city === this.selectedCity,
      );
      if (loc) this.$emit("select", loc);
    },
    /** Allows the parent to sync selects when history/selection changes externally. */
    setSelection(location) {
      if (!location) return;
      this.selectedCountry = location.country;
      this.selectedCity = location.city;
    },
  },
};
</script>

<style scoped>
.picker {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.picker__title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0;
  letter-spacing: 0.01em;
}

.picker__search {
  position: relative;
}

.picker__search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-faint);
  pointer-events: none;
}

.picker__search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 13px 40px;
  font-size: 15px;
  color: var(--text-primary);
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.picker__search-input::placeholder {
  color: var(--text-faint);
}

.picker__search-input:focus {
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.09);
}

.picker__clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-faint);
  font-size: 14px;
  padding: 6px;
  line-height: 1;
}

.picker__clear:hover {
  color: var(--text-primary);
}

.picker__suggestions {
  position: absolute;
  z-index: 20;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #16243c;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 6px;
  list-style: none;
  margin: 0;
  max-height: 260px;
  overflow-y: auto;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.picker__suggestion {
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  background: none;
  border: none;
  text-align: left;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
}

.picker__suggestion:hover,
.picker__suggestion:focus-visible {
  background: var(--surface-hover);
}

.picker__suggestion-city {
  font-weight: 600;
}

.picker__suggestion-country {
  font-size: 12.5px;
  color: var(--text-muted);
}

.picker__no-results {
  position: absolute;
  z-index: 20;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #16243c;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 14px;
  font-size: 13.5px;
  color: var(--text-muted);
}

.picker__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.picker__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.picker__label {
  font-size: 12px;
  color: var(--text-faint);
  font-weight: 500;
}

.picker__select {
  /* background: rgba(255, 255, 255, 0.06); */
  background-color: #213559;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 11px 12px;
  font-size: 14px;
  color: var(--text-primary);
  appearance: none;
  width: 120px;
}

.picker__select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.picker__select:focus {
  border-color: var(--accent);
}
</style>
