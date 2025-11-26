import { Request, Response } from 'express';
import { DashboardService } from '../reporting-service/src/services/dashboardService';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.dashboardService.getDashboardStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch dashboard statistics'
      });
    }
  };

  getStoredDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.dashboardService.getStoredDashboardStats();
      if (!stats) {
        res.status(404).json({ error: 'No dashboard data found' });
        return;
      }
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

