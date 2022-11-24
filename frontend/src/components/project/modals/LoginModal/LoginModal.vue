<template>
  <app-modal
    :open="props.open"
    :closable="false"
    title="Вход"
    size="small"
    title-size="medium"
  >
    <form
      class="login-modal"
      @submit.prevent="doLogin"
    >
      <app-input
        v-model="loginData.login"
        :validators="{ required }"
        :icon="ProfileIcon"
        :state="fieldState('login')"
        :message="apiErrorMessage.login"
        label="Login"
        clearable
        @input="clearApiError"
      />

      <app-input
        v-model="loginData.password"
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
        text="Login"
        text-bold
        full-width
        :loading="loading"
      />

      <app-link
        size="medium"
        class="login-modal__link"
        @click="goToRegister"
      >
        Регистрация
      </app-link>
    </form>
  </app-modal>
</template>

<script setup lang="ts">
import {
  defineProps, withDefaults, defineEmits,
} from 'vue';
import { storeToRefs } from 'pinia';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { useAuthStore } from '@/stores/auth';

import AppModal from '@/components/base/AppModal/AppModal.vue';
import AppButton from '@/components/base/AppButton/AppButton.vue';
import AppLink from '@/components/base/AppLink.vue';
import AppInput from '@/components/base/AppInput/AppInput.vue';

import { ProfileIcon } from '@/assets/icons';

interface Props {
  open: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

interface Events {
  (e: 'go-to-register'): void,
}

const emit = defineEmits<Events>();

const authStore = useAuthStore();

const {
  fieldState, apiErrorMessage, loading, loginData,
} = storeToRefs(authStore);

const { clearApiError, login } = authStore;

const v = useVuelidate();

const doLogin = async () => await v.value.$validate() && login();

const goToRegister = () => {
  clearApiError();
  emit('go-to-register');
};
</script>

<style lang="scss" scoped>
.login-modal {
  display: grid;
  grid-gap: 16px;
  margin-top: 24px;

  &__link {
    text-align: center;
  }
}
</style>
