<template>
  <inline-svg
    :src="props.icon"
    :style="{ '--icon-size': `${props.size}px` }"
    class="app-icon"
  />
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface Props {
  icon: string,
  size?: 20 | 24 | 48 | 56,
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
});
</script>

<style lang="scss">
.app-icon {
  height: var(--icon-size, 24px);
  width: var(--icon-size, 24px);
}
</style>
