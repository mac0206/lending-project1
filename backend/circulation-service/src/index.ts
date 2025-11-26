import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoanController } from '../../controller/loanController';
import { ReturnController } from '../../controller/returnController';
import { HealthCheckService } from './services/healthCheckService';
import { connectDatabase, disconnectDatabase } from './utils/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const SERVICE_NAME = 'Circulation Service';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-system';

// Middleware
app.use(cors());
app.use(express.json());

// Controllers
const loanController = new LoanController();
const returnController = new ReturnController();
const healthCheckService = new HealthCheckService();

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'circulation-service',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/health/dependencies', async (req, res) => {
  try {
    const catalogHealth = await healthCheckService.checkCatalogService();
    res.json({
      service: 'circulation-service',
      dependencies: {
        catalog: catalogHealth
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Loan routes (Member B requirements)
app.post('/api/loans/borrow', loanController.createLoan); // Borrow an item
app.post('/api/loans/return', returnController.returnBookByBookId); // Return an item
app.get('/api/loans', loanController.getAllLoans); // List all loans (current + history)
app.get('/api/loans/active', loanController.getActiveLoans);
app.get('/api/loans/overdue', loanController.getOverdueLoans);
app.get('/api/loans/member/:memberId', loanController.getLoansByMemberId);
app.get('/api/loans/item/:itemId', loanController.getLoansByBookId);
app.get('/api/loans/:id', loanController.getLoanById);
app.get('/api/items/:itemId/availability', loanController.checkAvailability);

// Legacy routes (for backward compatibility)
app.post('/api/loans', loanController.createLoan);
app.post('/api/returns/loan/:loanId', returnController.returnBook);
app.post('/api/returns/book/:bookId', returnController.returnBookByBookId);
app.post('/api/returns/update-overdue', returnController.updateOverdueItems);
app.get('/api/books/:bookId/availability', loanController.checkAvailability);

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

