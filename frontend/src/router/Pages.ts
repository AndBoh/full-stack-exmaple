const Pages = {
  RootPage: {
    path: '/',
    name: 'RootPage',
    component: () => import('@/views/RootPage.vue'),
  },

  AppPage: {
    path: '/app',
    name: 'AppPage',
    component: () => import('@/views/AppPage.vue'),
    meta: {
      authRequired: true,
    },
  },

  AuthPage: {
    path: '/sign',
    name: 'AuthPage',
    component: () => import('@/views/AuthPage.vue'),
  },
};

export const routes = Object.values(Pages);

export default Pages;
