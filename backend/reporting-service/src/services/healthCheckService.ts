import { ApiClient } from '../utils/apiClient';

const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const CIRCULATION_SERVICE_URL = process.env.CIRCULATION_SERVICE_URL || 'http://localhost:3002';

const catalogApi = new ApiClient(CATALOG_SERVICE_URL, 'HealthCheck->Catalog');
const circulationApi = new ApiClient(CIRCULATION_SERVICE_URL, 'HealthCheck->Circulation');

export class HealthCheckService {
  async checkAllServices(): Promise<{
    catalog: { healthy: boolean; message: string };
    circulation: { healthy: boolean; message: string };
  }> {
    const [catalogHealth, circulationHealth] = await Promise.all([
      this.checkCatalogService(),
      this.checkCirculationService()
    ]);

    return {
      catalog: catalogHealth,
      circulation: circulationHealth
    };
  }

  async checkCatalogService(): Promise<{ healthy: boolean; message: string }> {
    try {
      const response = await catalogApi.get('/health');
      return {
        healthy: response.data.status === 'ok',
        message: 'Catalog service is healthy'
      };
    } catch (error: any) {
      return {
        healthy: false,
        message: `Catalog service is unavailable: ${error.message}`
      };
    }
  }

  async checkCirculationService(): Promise<{ healthy: boolean; message: string }> {
    try {
      const response = await circulationApi.get('/health');
      return {
        healthy: response.data.status === 'ok',
        message: 'Circulation service is healthy'
      };
    } catch (error: any) {
      return {
        healthy: false,
        message: `Circulation service is unavailable: ${error.message}`
      };
    }
  }
}

