<template>
  <button
    class="app-button"
    :class="modifiers.component"
    :disabled="disabled"
  >
    <app-icon
      v-if="props.loading"
      :icon="LoaderIcon"
      class="app-button__loader"
    />
    <span class="app-button__content">
      <slot>
        {{ text }}
      </slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import {
  computed, defineProps, withDefaults, useAttrs,
} from 'vue';

import AppIcon from '@/components/base/AppIcon/AppIcon.vue';

import { LoaderIcon } from '@/assets/icons';

interface Props {
  buttonType?: 'primary' | 'secondary' | 'subtle' | 'text';
  size?: 'large' | 'medium' | 'small' | 'icon';
  radius?: 'large' | 'medium' | 'small';
  loading?: boolean;
  text?: string;
  textBold?: boolean;
  fullWidth?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  buttonType: 'primary',
  size: 'medium',
  radius: 'medium',
  loading: false,
  text: '',
  textBold: false,
  fullWidth: false,
});

const attrs = useAttrs();

const modifiers = computed(() => ({
  component: [
    `app-button--type-${props.buttonType}`,
    `app-button--size-${props.size}`,
    `app-button--radius-${props.radius}`,
    `text--${['large', 'medium'].includes(props.size) ? 'small' : 'xsmall'}`,
    {
      'app-button--loading': props.loading,
      'app-button--full-width': props.fullWidth,
      'text--bold': props.textBold,
    },
  ],
}));

const disabled = computed(() => attrs.disabled || props.loading);
</script>

<style lang="scss" scoped>
@import "variables";
@import "mixins";

.app-button {
  @include transition((background-color, color, border-color));

  position: relative;
  cursor: pointer;
  border: var(--button-border-size, $button-border-size) solid;
  display: inline-grid;
  place-items: center;

  &:disabled {
    cursor: not-allowed;

    &:not(.app-button--loading) {
      opacity: 0.5;
    }
  }

  &:focus {
    outline: var(--button-outline-focus-size, $button-outline-size-focus)
    var(--button-outline-color-focus, $button-outline-color-focus)
    solid;
  }

  &--loading {
    .app-button__content {
      opacity: 0;
    }
  }

  &--full-width {
    width: 100%;
  }

  &__loader {
    position: absolute;
    height: var(--button-loader-height, $button-loader-height);
    width: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  @include button--radius;

  @include button--size;

  @include button--type;
}
</style>
