import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ApiResponse, SigninRequest, TokenPayload, TokenResponse } from '@/api';
import { refreshToken, signIn } from '@/api/auth';
import type { AxiosResponse } from 'axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const prefix = 'token';
  const token = ref<string | null>(null);
  const refresh = ref<string | null>(null);
  const payload = ref<TokenPayload | null>(null);

  function isExpired(expire: number): boolean {
    return expire - 1000 < new Date().getTime();
  }

  async function setAuth(data: TokenResponse) {
    const timestamp = new Date().getTime();

    setTimeout(async () => {
      console.log('access token is expired');
      const res = await refreshToken({ refreshToken: data.refreshToken });
      await saveToken(res);
      return;
    }, data.accessExpire - timestamp);

    token.value = data.accessToken;
    refresh.value = data.refreshToken;
    payload.value = JSON.parse(atob(token.value.split('.')[1])) as TokenPayload;
    const tokenStr = JSON.stringify(data);
    localStorage.setItem(prefix, tokenStr);

    if (isExpired(data.accessExpire)) {
      if (isExpired(data.refreshExpire)) {
        logout();
        return;
      }

      const res = await refreshToken({ refreshToken: refresh.value });
      await saveToken(res);
      return;
    }
  }

  function isAuthenticated(): boolean {
    return token.value != null && refresh.value != null && payload.value != null;
  }

  async function loadAuth() {
    const localToken = localStorage.getItem(prefix);
    if (localToken != null) {
      const token = JSON.parse(localToken) as TokenResponse;
      await setAuth(token);
    }
  }

  async function saveToken(res: AxiosResponse<ApiResponse<TokenResponse>>): Promise<void> {
    if (res.status === 200 && res.data.code === 0) {
      if (res.data.result) await setAuth(res.data.result);
    }
  }

  async function login(body: SigninRequest): Promise<AxiosResponse<ApiResponse<TokenResponse>>> {
    const res = await signIn(body);
    await saveToken(res);
    return res;
  }

  function logout() {
    console.log('logout');
    localStorage.removeItem(prefix);
    token.value = null;
    refresh.value = null;
    payload.value = null;
    router.push({ name: 'signIn' });
  }

  loadAuth();

  return { payload, token, refresh, login, logout, isAuthenticated };
});
