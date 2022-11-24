import { defineStore } from 'pinia';

import { UserStoreState } from '@/stores/user/types';
import { Me } from '@/api/interfaces/User';

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    me: undefined,
  }),

  getters: {},

  actions: {
    setMe(me: Me | undefined) {
      this.me = me;
    },
  },
});
