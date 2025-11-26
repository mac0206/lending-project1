import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DashboardController } from '../../controller/dashboardController';
import { StatisticsController } from '../../controller/statisticsController';
import { HealthCheckService } from './services/healthCheckService';
import { connectDatabase, disconnectDatabase } from './utils/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT2 || 3003;
const SERVICE_NAME = 'Reporting Service';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-system';

// Middleware
app.use(cors());
app.use(express.json());

// Controllers
const dashboardController = new DashboardController();
const statisticsController = new StatisticsController();
const healthCheckService = new HealthCheckService();

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'reporting-service',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/health/dependencies', async (req, res) => {
  try {
    const dependencies = await healthCheckService.checkAllServices();
    res.json({
      service: 'reporting-service',
      dependencies
    });
  } catch (error: any) {
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
    await connectDatabase(MONGODB_URI, SERVICE_NAME);
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 ${SERVICE_NAME} is running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error: any) {
    console.error(`\n❌ ${SERVICE_NAME} failed to start:`, error.message);
    console.error('Please check your MongoDB connection and try again.\n');
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log(`\n⚠️  Shutting down ${SERVICE_NAME}...`);
  await disconnectDatabase(SERVICE_NAME);
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log(`\n⚠️  Shutting down ${SERVICE_NAME}...`);
  await disconnectDatabase(SERVICE_NAME);
  process.exit(0);
});

// Start the server
startServer();

