"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiClient {
    constructor(baseURL, serviceName) {
        this.client = axios_1.default.create({
            baseURL,
            timeout: 10000, // 10 seconds timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Request interceptor for logging
        this.client.interceptors.request.use((config) => {
            console.log(`[${serviceName}] ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            console.error(`[${serviceName}] Request error:`, error);
            return Promise.reject(error);
        });
        // Response interceptor for error handling
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response) {
                console.error(`[${serviceName}] Response error:`, error.response.status, error.response.data);
            }
            else if (error.request) {
                console.error(`[${serviceName}] No response received:`, error.request);
            }
            else {
                console.error(`[${serviceName}] Error:`, error.message);
            }
            return Promise.reject(error);
        });
    }
    get(url) {
        return this.client.get(url);
    }
    post(url, data) {
        return this.client.post(url, data);
    }
    put(url, data) {
        return this.client.put(url, data);
    }
    delete(url) {
        return this.client.delete(url);
    }
}
exports.ApiClient = ApiClient;
