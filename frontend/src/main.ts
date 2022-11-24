import { createApp } from 'vue';

import './registerServiceWorker';

import { createPinia } from 'pinia';
import InlineSvg from 'vue-inline-svg';
import { registerCheckAuthHook } from '@/router/helpers/registerCheckAuthHook';
import App from './App.vue';
import router from './router';

registerCheckAuthHook(router);

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(router)
  .component('inline-svg', InlineSvg)
  .mount('#app');
