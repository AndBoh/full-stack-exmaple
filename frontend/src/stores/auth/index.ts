import { defineStore } from 'pinia';
import { AxiosError, AxiosResponse } from 'axios';

import { AuthField, AuthStoreState } from '@/stores/auth/types';

import router from '@/router';
import Pages from '@/router/Pages';

import { useUserStore } from '@/stores/user';

import { ApiErrorData } from '@/api/interfaces/ApiErrorData';
import { Me } from '@/api/interfaces/User';
import API from '@/api';

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => ({
    loading: false,
    apiErrorMessage: {
      login: '',
      password: '',
      name: '',
    },
    loginData: {
      login: '',
      password: '',
    },
    registerData: {
      login: '',
      password: '',
      name: '',
    },
  }),

  getters: {
    hasApiError: (state) => Object.values(state.apiErrorMessage)
      .some((message) => message.length > 0),

    fieldState: (state) => (field: AuthField) => (state.apiErrorMessage[field].length > 0 ? 'error' : 'normal'),
  },

  actions: {
    async getMe() {
      const { setMe } = useUserStore();
      const { data } = await API.GetMe.request();
      setMe(data);
    },

    async doAuthAction(action: () => Promise<AxiosResponse<Me>>) {
      if (this.loading) {
        return;
      }

      this.loading = true;

      try {
        const { setMe } = useUserStore();
        const { data } = await action();
        setMe(data);
        await router.push(Pages.AppPage);
      } catch (e) {
        const { response } = e as AxiosError;
        const { message, errors, code } = response?.data as ApiErrorData;

        // Коды ошибок можно экспортировать с бэка через
        if (['NOT_FOUND', 'CONFLICT'].includes(code) && message) {
          this.setApiErrorMessage(message, 'login');
        }

        if (['BAD_REQUEST', 'VALIDATION_ERROR'].includes(code) && errors) {
          errors.forEach((error) => {
            // При ошибке с этими кодами поле error.token должно соответствовать одному
            // из полей apiErrorMessage (тип AuthField)
            const { type, token } = error;
            // Текст ошибки должен браться из словаря на основании поля type
            // вместо наивной подстановки
            this.setApiErrorMessage(type, token as AuthField);
          });
        }
        return;
      } finally {
        this.loading = false;
      }
    },

    async login() {
      return this.doAuthAction(
        () => API.Login.request({ data: this.loginData }),
      );
    },

    async register() {
      return this.doAuthAction(
        () => API.Register.request({ data: this.registerData }),
      );
    },

    setApiErrorMessage(message: string, field: AuthField) {
      this.apiErrorMessage[field] = message;
    },

    clearApiError() {
      this.apiErrorMessage = {
        login: '',
        password: '',
        name: '',
      };
    },
  },
});
