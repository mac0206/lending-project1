"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const loanController_1 = require("../../controller/loanController");
const returnController_1 = require("../../controller/returnController");
const healthCheckService_1 = require("./services/healthCheckService");
const database_1 = require("./utils/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
const SERVICE_NAME = 'Circulation Service';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-system';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Controllers
const loanController = new loanController_1.LoanController();
const returnController = new returnController_1.ReturnController();
const healthCheckService = new healthCheckService_1.HealthCheckService();
// Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'circulation-service',
        timestamp: new Date().toISOString(),
        database: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected'
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
    }
    catch (error) {
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
