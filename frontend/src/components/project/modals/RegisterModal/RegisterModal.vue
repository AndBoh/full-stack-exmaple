<template>
  <app-modal
    :open="props.open"
    :closable="false"
    title="Регистрация"
    size="small"
    title-size="medium"
  >
    <form
      class="register-modal"
      @submit.prevent="doRegister"
    >
      <app-input
        v-model="registerData.login"
        :validators="{ required }"
        :icon="ProfileIcon"
        :state="fieldState('login')"
        :message="apiErrorMessage.login"
        label="Login"
        clearable
        @input="clearApiError"
      />

      <app-input
        v-model="registerData.name"
        label="Name"
        :validators="{ required }"
        :message="apiErrorMessage.name"
        :state="fieldState('name')"
        @input="clearApiError"
      />

      <app-input
        v-model="registerData.password"
        label="Password"
        type="password"
        :validators="{ required }"
        :message="apiErrorMessage.password"
        :state="fieldState('password')"
        @input="clearApiError"
      />

      <app-button
        type="submit"
        size="medium"
        text="Register"
        text-bold
        full-width
        :loading="loading"
      />

      <app-link
        size="medium"
        class="register-modal__link"
        @click="goToLogin"
      >
        Вход
      </app-link>
    </form>
  </app-modal>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, withDefaults } from 'vue';
import { storeToRefs } from 'pinia';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import AppModal from '@/components/base/AppModal/AppModal.vue';
import AppInput from '@/components/base/AppInput/AppInput.vue';
import AppLink from '@/components/base/AppLink.vue';
import AppButton from '@/components/base/AppButton/AppButton.vue';

import { ProfileIcon } from '@/assets/icons';

import { useAuthStore } from '@/stores/auth';

interface Props {
  open: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

interface Events {
  (e: 'go-to-login'): void,
}

const emit = defineEmits<Events>();

const authStore = useAuthStore();

const {
  fieldState, apiErrorMessage, loading, registerData,
} = storeToRefs(authStore);

const { clearApiError, register } = authStore;

const v = useVuelidate();

const doRegister = async () => await v.value.$validate() && register();

const goToLogin = () => {
  clearApiError();
  emit('go-to-login');
};
</script>

<style lang="scss">
.register-modal {
  display: grid;
  grid-gap: 16px;
  margin-top: 24px;

  &__link {
    text-align: center;
  }
}
</style>
