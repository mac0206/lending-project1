"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboardService_1 = require("../reporting-service/src/services/dashboardService");
class DashboardController {
    constructor() {
        this.getDashboard = async (req, res) => {
            try {
                const stats = await this.dashboardService.getDashboardStats();
                res.json({
                    success: true,
                    data: stats
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch dashboard statistics'
                });
            }
        };
        this.getStoredDashboard = async (req, res) => {
            try {
                const stats = await this.dashboardService.getStoredDashboardStats();
                if (!stats) {
                    res.status(404).json({ error: 'No dashboard data found' });
                    return;
                }
                res.json(stats);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.dashboardService = new dashboardService_1.DashboardService();
    }
}
exports.DashboardController = DashboardController;
