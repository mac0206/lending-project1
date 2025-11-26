"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckService = void 0;
const apiClient_1 = require("../utils/apiClient");
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const catalogApi = new apiClient_1.ApiClient(CATALOG_SERVICE_URL, 'HealthCheck');
class HealthCheckService {
    async checkCatalogService() {
        try {
            const response = await catalogApi.get('/health');
            return {
                healthy: response.data.status === 'ok',
                message: 'Catalog service is healthy'
            };
        }
        catch (error) {
            return {
                healthy: false,
                message: `Catalog service is unavailable: ${error.message}`
            };
        }
    }
}
exports.HealthCheckService = HealthCheckService;
