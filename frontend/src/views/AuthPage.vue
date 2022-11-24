<template>
  <login-modal
    :open="state === 'login'"
    @go-to-register="state = 'register'"
  />
  <register-modal
    :open="state === 'register'"
    @go-to-login="state = 'login'"
  />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import LoginModal from '@/components/project/modals/LoginModal/LoginModal.vue';
import RegisterModal from '@/components/project/modals/RegisterModal/RegisterModal.vue';

type AuthState = 'login' | 'register';

const state: Ref<AuthState> = ref('login');
</script>

<style lang="scss">
</style>
