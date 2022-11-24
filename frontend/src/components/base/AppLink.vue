<template>
  <a
    :class="modifiers.component"
    class="app-link"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';

interface Props {
  size?: 'large' | 'medium' | 'small' | 'xsmall',
  bold?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  size: 'small',
  bold: false,
});

const modifiers = computed(() => ({
  component: [
    `text--${props.size}`,
    {
      'text--bold': props.bold,
    },
  ],
}));
</script>

<style lang="scss">
.app-link {
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
