import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosPromise,
} from "axios";
import { API_BASE_URL } from "../../../constants";
import { getAccessToken } from "@privy-io/react-auth";

export type RequestPromise<T> = AxiosPromise<T>;
export type AxiosCustomHeaderType = {
  // 当前接口是否需要携带token
  needToken?: boolean;
  // 当前接口手动设置的token
  token?: string;
};
export type AxiosHeaders = AxiosRequestHeaders & AxiosCustomHeaderType;

export type AxiosCustomConfigType = AxiosRequestConfig & {
  headers?: AxiosHeaders;
};

let userToken: string;
export const injectUserToken = (value: string) => {
  userToken = value;
};
export const getUserToken = () => userToken;

const axiosInstance = axios.create();
// 请求超时的毫秒数(0 表示无超时时间)
// axiosInstance.defaults.timeout = 30000

axiosInstance.defaults.baseURL = API_BASE_URL;

axiosInstance.interceptors.request.use(
  async(config) => {
    if (!config?.headers) {
      config.headers = {} as AxiosHeaders;
    }
    if (config.headers?.token) {
      config.headers["Authorization"] = config.headers?.token;
    } else if (config.headers?.needToken) {
      const privyToken = await getAccessToken() // privy token时效1小时所以必须实时获取privy token，不能使用injectUserToken注入
      config.headers["Authorization"] = privyToken || "";
      delete config.headers.needToken;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
