"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckService = void 0;
const apiClient_1 = require("../utils/apiClient");
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const CIRCULATION_SERVICE_URL = process.env.CIRCULATION_SERVICE_URL || 'http://localhost:3002';
const catalogApi = new apiClient_1.ApiClient(CATALOG_SERVICE_URL, 'HealthCheck->Catalog');
const circulationApi = new apiClient_1.ApiClient(CIRCULATION_SERVICE_URL, 'HealthCheck->Circulation');
class HealthCheckService {
    async checkAllServices() {
        const [catalogHealth, circulationHealth] = await Promise.all([
            this.checkCatalogService(),
            this.checkCirculationService()
        ]);
        return {
            catalog: catalogHealth,
            circulation: circulationHealth
        };
    }
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
    async checkCirculationService() {
        try {
            const response = await circulationApi.get('/health');
            return {
                healthy: response.data.status === 'ok',
                message: 'Circulation service is healthy'
            };
        }
        catch (error) {
            return {
                healthy: false,
                message: `Circulation service is unavailable: ${error.message}`
            };
        }
    }
}
exports.HealthCheckService = HealthCheckService;
