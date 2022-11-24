import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Me } from '@/api/interfaces/User';

class ApiMethod<Response, RequestData = never> {
  constructor(
    private readonly url: string,
    private readonly method: 'get' | 'post',
  ) {
    this.url = url;
    this.method = method;
  }

  request<D = RequestData>(config: AxiosRequestConfig<D> = {}): Promise<AxiosResponse<Response>> {
    return axios.request<Response, AxiosResponse<Response>, D>({
      url: this.url,
      method: this.method,
      ...config,
    });
  }
}

const API = {
  GetMe: new ApiMethod<Me>('/auth', 'get'),
  Login: new ApiMethod<Me>('/auth/login', 'post'),
  Register: new ApiMethod<Me>('/auth/register', 'post'),
};

export default API;
