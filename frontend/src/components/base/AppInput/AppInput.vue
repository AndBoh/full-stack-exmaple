<template>
  <div
    :class="modifiers.component"
    class="app-input"
  >
    <div class="app-input__input-wrapper">
      <input
        ref="inputRef"
        v-bind="$attrs"
        :class="modifiers.input"
        :value="props.modelValue"
        placeholder=" "
        class="app-input__input"
        @input="emitValue($event.target.value)"
      />

      <div
        v-if="hasIcon"
        class="app-input__icon"
      >
        <slot
          name="icon"
        >
          <app-icon :icon="props.icon" />
        </slot>
      </div>

      <span
        :class="modifiers.label"
        class="app-input__label"
      >
        {{ label }}
      </span>

      <app-icon
        v-if="showClear"
        :icon="CloseIcon"
        :size="20"
        class="app-input__clear"
        @click="clearValue"
      />
    </div>

    <div
      v-if="showMessage"
      :class="modifiers.message"
      class="app-input__message"
    >
      {{ messageText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps, defineEmits, computed, withDefaults, useSlots, ref,
} from 'vue';
import { useVuelidate, ValidationArgs } from '@vuelidate/core';

import AppIcon from '@/components/base/AppIcon/AppIcon.vue';

import { CloseIcon } from '@/assets/icons';

interface Props {
  modelValue: string,
  clearable?: boolean,
  label: string,
  state?: 'normal' | 'success' | 'error',
  radius?: 'large' | 'medium' | 'small',
  size?: 'large' | 'small',
  icon?: string,
  labelBold?: boolean,
  messageBold?: boolean,
  immediateValidation?: boolean,
  keepMessageSpace?: boolean,
  message?: string,
  ignoreValidationState?: boolean,
  validators?: ValidationArgs,
}

const props = withDefaults(defineProps<Props>(), {
  validators: Object.create({}),
  clearable: false,
  state: 'normal',
  size: 'large',
  radius: 'medium',
  labelBold: false,
  messageBold: false,
  immediateValidation: false,
  message: '',
  keepMessageSpace: false,
  ignoreValidationState: false,
});

interface Events {
  (e: 'update:modelValue', value: string): void;
}

const emit = defineEmits<Events>();

const slots = useSlots();

const inputRef = ref(null);

const state = computed(() => ({
  value: props.modelValue,
}));

const rules = {
  value: props.validators,
};

const v = useVuelidate(rules, state, { $autoDirty: props.immediateValidation });

const hasIcon = !!slots.icon || !!props.icon;

const showClear = computed(() => props.clearable && state.value.value.length > 0);

const hasValidationError = computed(() => v.value.$error);

const showMessage = computed(() => props.keepMessageSpace
  || props.message.length > 0
  || hasValidationError.value);

const messageText = computed(() => props.message || v.value.$errors[0]?.$message);

const modifiers = computed(() => ({
  component: [
    hasValidationError.value && !props.ignoreValidationState
      ? 'app-input--state-error'
      : `app-input--state-${props.state}`,
    {
      'app-input--has-icon': hasIcon,
      'app-input--clearable': showClear.value,
    },
  ],
  label: [
    props.size === 'small' ? 'text-xsmall' : 'text-small',
    {
      'text--bold': props.labelBold,
    },
  ],
  input: [
    'text--small',
    `app-input__input--size-${props.size}`,
    `app-input__input--radius-${props.radius}`,
  ],
  message: [
    'text--xsmall',
    {
      'text--bold': props.messageBold,
    },
  ],
}));

const emitValue = (value: string) => {
  emit('update:modelValue', value);
};

const clearValue = () => {
  emitValue('');

  if (inputRef.value) {
    (inputRef.value as HTMLElement).focus();
  }
};
</script>

<style lang="scss">
@import "variables";
@import "mixins";

.app-input {
  display: grid;
  grid-gap: 6px;

  &__input-wrapper {
    position: relative;
  }

  &__icon {
    @include transition(color);
    @include absolute-vertical-center;

    left: 24px;
  }

  &__input {
    @include transition(border-color);

    outline: none;
    border: var(--input-border-size, $input-border-size) solid;
    padding: 12px var(--input-padding-right, 24px) 12px var(--input-padding-left, 24px);
    display: block;
    width: 100%;
    color: $color-title-active;

    &:disabled {
      opacity: 0.5;

      & ~ * {
        opacity: 0.5;
      }
    }

    &:not(:placeholder-shown),
    &:focus {
      padding-top: 30px;
      padding-bottom: 7px;

      & ~ .app-input__label {
        transform: translateY(-100%);
      }
    }

    @include input--radius;

    @include input--size;
  }

  &__label {
    @include transition((transform, color));

    position: absolute;
    left: var(--input-padding-left, 24px);
    right: var(--input-padding-right, 24px);
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  &__clear {
    @include transition(color);
    @include absolute-vertical-center;

    right: 24px;
    cursor: pointer;
  }

  &__message {
    min-height: 22px;
    padding: 0 4px;
  }

  &--has-icon {
    --input-padding-left: 64px
  }

  &--clearable {
    --input-padding-right: 64px;
  }

  @include input--state;
}
</style>
