<template>
  <div class="history">
    <div class="history__head">
      <h2 class="history__title">Recent Searches</h2>
      <button v-if="items.length" type="button" class="history__clear" @click="$emit('clear')">
        Clear
      </button>
    </div>

    <p v-if="!items.length" class="history__empty">
      Your last 5 searches will show up here.
    </p>

    <ul v-else class="history__list">
      <li v-for="(item, index) in items" :key="item.city + item.country + index">
        <button
          type="button"
          class="history__item"
          :class="{ 'history__item--active': isActive(item) }"
          @click="$emit('select', item)"
        >
          <span class="history__item-icon" aria-hidden="true">📍</span>
          <span class="history__item-text">
            <span class="history__item-city">{{ item.city }}</span>
            <span class="history__item-country">{{ item.country }}</span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    activeLocation: {
      type: Object,
      default: null,
    },
  },
  emits: ['select', 'clear'],
  methods: {
    isActive(item) {
      return (
        this.activeLocation &&
        this.activeLocation.city === item.city &&
        this.activeLocation.country === item.country
      )
    },
  },
}
</script>

<style scoped>
.history__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history__title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0;
}

.history__clear {
  background: none;
  border: none;
  color: var(--text-faint);
  font-size: 12.5px;
  text-decoration: underline;
  text-underline-offset: 2px;
  padding: 2px;
}

.history__clear:hover {
  color: var(--danger);
}

.history__empty {
  margin: 12px 0 0;
  font-size: 13.5px;
  color: var(--text-faint);
  line-height: 1.5;
}

.history__list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  text-align: left;
}

.history__item:hover {
  background: var(--surface-hover);
}

.history__item--active {
  border-color: rgba(246, 172, 72, 0.4);
  background: var(--accent-soft);
}

.history__item-icon {
  font-size: 13px;
  opacity: 0.7;
}

.history__item-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.history__item-city {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
}

.history__item-country {
  font-size: 11.5px;
  color: var(--text-faint);
}
</style>
