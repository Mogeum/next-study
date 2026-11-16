"use client";

import axios, { type AxiosInstance } from "axios";

export const httpClient = (() => {
  // baseURL은 백엔드가 아니라 같은 출처의 Route Handler.
  // 토큰은 httpOnly 쿠키라 JS가 못 읽으므로 request 인터셉터로 주입하지 않고,
  // 브라우저가 쿠키를 자동 첨부 → Route Handler가 Authorization 헤더로 변환한다.
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true,
    paramsSerializer: {
      serialize: (params: Record<string, unknown>) => {
        const searchParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
          const value = params[key];

          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)));
          } else if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });

        return searchParams.toString();
      },
    },
  });

  // ── response 인터셉터: 성공 핸들러 / 실패 핸들러 ──
  axiosInstance.interceptors.response.use(
    // 성공: 공통 응답 래퍼 벗기기. { data: { ... } } → { ... }
    (response) => response.data?.data ?? response.data,

    // 실패: 401이면 로그인으로. 쿠키 삭제는 서버만 할 수 있으므로 여기선 이동만.
    (error) => {
      if (error.response?.status === 401) {
        // 인터셉터는 React 밖이라 useRouter 못 씀
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
      return Promise.reject(error); // 안 하면 에러가 성공으로 삼켜짐
    },
  );

  return {
    // 인터셉터가 래퍼를 벗겨 T를 내보내지만 axios 타입은 AxiosResponse<T>라 캐스팅 필요
    get<T>(url: string, options?: { params?: Record<string, unknown> }) {
      return axiosInstance.get(url, options) as unknown as Promise<T>;
    },

    post<T>(url: string, data?: unknown) {
      return axiosInstance.post(url, data) as unknown as Promise<T>;
    },

    put<T>(url: string, data?: unknown) {
      return axiosInstance.put(url, data) as unknown as Promise<T>;
    },

    patch<T>(url: string, data?: unknown) {
      return axiosInstance.patch(url, data) as unknown as Promise<T>;
    },

    delete<T>(url: string) {
      return axiosInstance.delete(url) as unknown as Promise<T>;
    },
  };
})();
