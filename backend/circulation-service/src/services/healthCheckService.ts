import { ApiClient } from '../utils/apiClient';

const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const catalogApi = new ApiClient(CATALOG_SERVICE_URL, 'HealthCheck');

export class HealthCheckService {
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
}

