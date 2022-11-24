interface LoginData {
  login: string,
  password: string,
}

interface RegisterData {
  login: string,
  password: string,
  name: string,
}

export type AuthField = keyof LoginData | keyof RegisterData;

type ApiErrorMessageMap = Record<AuthField, string>

export interface AuthStoreState {
  loading: boolean,
  apiErrorMessage: ApiErrorMessageMap,
  loginData: LoginData,
  registerData: RegisterData,
}
