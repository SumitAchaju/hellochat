import axios from "axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../store/userStore";

const BaseUrl = "http://localhost:8000";
const BaseUrl2 = "http://localhost:3000";

let isTokenRefreshing = false;
let newTokenPromise: Promise<AxiosResponse<any, any>> | null = null;

export default function useAxios(express: boolean = false) {
  const { setLoginStatus, setDecodedToken } = useUserStore();
  const instance = axios.create({
    baseURL: express ? BaseUrl2 : BaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (localStorage.getItem("access")) {
    instance.interceptors.request.use(async (config) => {
      let token = localStorage.getItem("access");

      if (checkTokenExpire(token) && !isTokenRefreshing) {
        isTokenRefreshing = true;
        newTokenPromise = getRefreshToken()
          .then((newToken) => {
            localStorage.setItem("access", newToken.data.access);
            localStorage.setItem("refresh", newToken.data.refresh);
            setDecodedToken(jwtDecode(newToken.data.access));
            isTokenRefreshing = false;
            newTokenPromise = null;
            return newToken;
          })
          .catch((error) => {
            setLoginStatus(false);
            setDecodedToken(null);
            isTokenRefreshing = false;
            newTokenPromise = null;
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("roomId");
            return error;
          });
      }

      // If token is refreshing, wait for the new token
      if (isTokenRefreshing && newTokenPromise !== null) {
        try {
          const newToken = await newTokenPromise;
          token = newToken.data.access_token;
        } catch (error) {
          const controller = new AbortController();
          config.signal = controller.signal;
          controller.abort();
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  return instance;
}

function checkTokenExpire(token: string | null) {
  if (token === null) return false;
  const decodedToken = jwtDecode(token);
  const currentDate = new Date();
  return decodedToken.exp !== undefined
    ? decodedToken.exp * 1000 < currentDate.getTime()
    : false;
}

async function getRefreshToken() {
  const refreshToken = localStorage.getItem("refresh");
  return await axios.post(BaseUrl + "/api/v1/token/refresh/", {
    token: refreshToken,
  });
}

export interface AxiosError<T = any, D = any> extends Error {
  config: AxiosRequestConfig<D>;
  code?: string;
  request?: any;
  response?: AxiosResponse<T, D>;
  isAxiosError: boolean;
  toJSON: () => object;
}
