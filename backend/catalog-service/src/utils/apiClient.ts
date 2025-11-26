import axios, { AxiosInstance, AxiosError } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, serviceName: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[${serviceName}] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error(`[${serviceName}] Request error:`, error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error(`[${serviceName}] Response error:`, error.response.status, error.response.data);
        } else if (error.request) {
          console.error(`[${serviceName}] No response received:`, error.request);
        } else {
          console.error(`[${serviceName}] Error:`, error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  get(url: string) {
    return this.client.get(url);
  }

  post(url: string, data?: any) {
    return this.client.post(url, data);
  }

  put(url: string, data?: any) {
    return this.client.put(url, data);
  }

  delete(url: string) {
    return this.client.delete(url);
  }
}

