"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const dashboardController_1 = require("../../controller/dashboardController");
const statisticsController_1 = require("../../controller/statisticsController");
const healthCheckService_1 = require("./services/healthCheckService");
const database_1 = require("./utils/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3003;
const SERVICE_NAME = 'Reporting Service';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-system';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Controllers
const dashboardController = new dashboardController_1.DashboardController();
const statisticsController = new statisticsController_1.StatisticsController();
const healthCheckService = new healthCheckService_1.HealthCheckService();
// Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'reporting-service',
        timestamp: new Date().toISOString(),
        database: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});
app.get('/health/dependencies', async (req, res) => {
    try {
        const dependencies = await healthCheckService.checkAllServices();
        res.json({
            service: 'reporting-service',
            dependencies
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Dashboard routes (Member C requirements)
app.get('/api/dashboard/overdue', statisticsController.getOverdueBooks); // Items past due date
app.get('/api/dashboard/stats', dashboardController.getDashboard); // Most borrowed items, borrow counts
app.get('/api/loans/history', statisticsController.getBorrowingHistory); // Full loan history
// Additional dashboard routes
app.get('/api/dashboard', dashboardController.getDashboard);
app.get('/api/dashboard/stored', dashboardController.getStoredDashboard);
// Statistics routes
app.get('/api/statistics/most-borrowed', statisticsController.getMostBorrowedBooks);
app.get('/api/statistics/borrowing-history', statisticsController.getBorrowingHistory);
app.get('/api/statistics/overdue', statisticsController.getOverdueBooks);
app.get('/api/statistics/member-stats', statisticsController.getMemberBorrowingStats);
// Start server only after MongoDB connection
const startServer = async () => {
    try {
        // Connect to MongoDB first
        await (0, database_1.connectDatabase)(MONGODB_URI, SERVICE_NAME);
        // Start Express server
        app.listen(PORT, () => {
            console.log(`\n🚀 ${SERVICE_NAME} is running on port ${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/health\n`);
        });
    }
    catch (error) {
        console.error(`\n❌ ${SERVICE_NAME} failed to start:`, error.message);
        console.error('Please check your MongoDB connection and try again.\n');
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log(`\n⚠️  Shutting down ${SERVICE_NAME}...`);
    await (0, database_1.disconnectDatabase)(SERVICE_NAME);
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log(`\n⚠️  Shutting down ${SERVICE_NAME}...`);
    await (0, database_1.disconnectDatabase)(SERVICE_NAME);
    process.exit(0);
});
// Start the server
startServer();
