<template>
  <teleport to=".modal__container">
    <transition name="modal-appear">
      <div v-if="props.open"
        class="modal"
        @click.self="clickOnBackdrop"
        @keydown.esc="clickOnBackdrop"
      >
        <div
        class="modal__spacer"
        @click.self="clickOnBackdrop"
        @keydown.esc="clickOnBackdrop"
      />

        <article
          v-bind="$attrs"
          :class="modifiers.window"
          class="modal__window"
        >
          <button
            v-if="props.closable"
            class="modal__close"
            @click="closeModal"
          >
            <inline-svg :src="CloseIcon" />
          </button>

          <header
            v-if="showHeader"
            :class="modifiers.header"
          >
            <slot name="header">
              {{ props.title }}
            </slot>
          </header>

          <section
            class="modal__content"
            :class="props.contentClass"
          >
            <slot/>
          </section>
        </article>
    </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import {
  defineProps, defineEmits, withDefaults, computed, useSlots,
} from 'vue';

import { CloseIcon } from '@/assets/icons';

interface Props {
  open: boolean,
  closeOnBackdrop?: boolean,
  closable?: boolean,
  title?: string,
  titleSize?: 'small' | 'medium' | 'large',
  size?: 'small' | 'medium' | 'large',
  titleBold?: boolean,
  contentClass?: string | object | string[],
}

interface Events {
  (e: 'update:open', value: boolean): void,
}

const props = withDefaults(defineProps<Props>(), {
  closeOnBackdrop: true,
  closable: true,
  title: '',
  titleSize: 'small',
  size: 'small',
  titleBold: false,
});

const emit = defineEmits<Events>();

const slots = useSlots();

const modifiers = computed(() => ({
  header: [
    `header--${props.titleSize}`,
    {
      'header--bold': props.titleBold,
    },
  ],
  window: [
    `modal__window--size-${props.size}`,
  ],
}));
const showHeader = computed(() => !!props.title || slots.header);

const closeModal = () => {
  if (!props.closable) {
    return;
  }

  emit('update:open', false);
};

const clickOnBackdrop = () => {
  if (!props.closeOnBackdrop) {
    return;
  }
  closeModal();
};
</script>

<style lang="scss" scoped>
@import "variables";
@import "mixins";

.modal {
  @include fixed-fullscreen;

  display: flex;
  flex-direction: column;
  backdrop-filter: blur(2px);

  @include breakpoint(tablet) {
    display: block;
    overflow-y: auto;
  }

  &__spacer {
    flex-grow: 1;

    @include breakpoint(tablet) {
      display: none;
    }
  }

  &__window {
    max-height: var(--modal-mobile-max-height, $modal-max-height-mobile);
    padding: var(--modal-window-padding-mobile, $modal-window-padding-mobile);
    background-color: $color-white;
    box-shadow: $shadow-large;
    border-radius: $radius-large $radius-large 0 0;
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: 100vw;
    overflow: hidden;

    @include breakpoint(tablet) {
      @include modal-window--size;

      margin: var(--modal-vertical-margin, $modal-vertical-margin) auto;
      padding: var(--modal-window-padding-desktop, $modal-window-padding-desktop);
      border-radius: $radius-large;
      max-height: unset;
    }
  }

  &__content {
    overflow-y: auto;

    @include breakpoint(tablet) {
      overflow-y: unset;
    }
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    height: 32px;
    width: 32px;
    padding: 4px;
    cursor: pointer;
    color: $color-placeholder;
    transition: color 0.15s ease-out;
    background-color: transparent;
    border: none;
    outline: none;
    display: none;

    &:hover {
      color: $color-body;
    }

    @include breakpoint(tablet) {
      display: block;
    }
  }
}

.modal__container {
  @include fixed-fullscreen;
  @include transition(background-color, $transition-duration-fast);

  overflow: hidden;
  pointer-events: none;

  &:has(.modal) {
    background-color: rgba($color-placeholder, 0.2);
    pointer-events: unset;
  }
}

@include vue-transition-active(modal-appear) {
  transition: transform 0.15s ease-out;
}

@include vue-transition-to-from(modal-appear) {
  transform: translateY(100%);
}
</style>
