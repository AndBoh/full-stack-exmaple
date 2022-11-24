<template>
  <div class="app-page">
    App

    {{ me }}
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const { me } = useUserStore();
</script>

<style lang="scss">
.app-page {

}
</style>
