import { NavigationGuardWithThis, Router } from 'vue-router';

import Pages from '@/router/Pages';

import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';

const checkAuthHook: NavigationGuardWithThis<undefined> = async (
  to,
  from,
  next,
) => {
  const { meta: { authRequired } } = to;

  if (authRequired) {
    try {
      const { me } = useUserStore();
      const { getMe } = useAuthStore();

      if (!me) {
        await getMe();
      }
      return next();
    } catch (e) {
      return next(Pages.AuthPage);
    }
  }

  return next();
};

export const registerCheckAuthHook = (router: Router) => {
  router.beforeEach(checkAuthHook);
};
