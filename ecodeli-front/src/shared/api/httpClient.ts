import axios from 'axios';
import { getApiConfig } from '../config/appConfig';

const { baseUrl, timeout } = getApiConfig();

export const httpClient = axios.create({
  baseURL: baseUrl,
  timeout,
});

httpClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
