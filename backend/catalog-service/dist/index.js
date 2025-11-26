"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const itemController_1 = require("../../controller/itemController");
const memberController_1 = require("../../controller/memberController");
const database_1 = require("./utils/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const SERVICE_NAME = 'Catalog Service';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-system';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Controllers
const itemController = new itemController_1.ItemController();
const memberController = new memberController_1.MemberController();
// Routes
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'catalog-service',
        timestamp: new Date().toISOString(),
        database: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});
// Item routes (Member A requirements)
app.post('/api/items', itemController.createItem);
app.get('/api/items', itemController.getAllItems);
app.get('/api/items/available', itemController.getAvailableItems);
app.get('/api/items/owner/:owner', itemController.getItemsByOwner);
app.get('/api/items/type/:type', itemController.getItemsByType);
app.get('/api/items/:id', itemController.getItemById);
app.put('/api/items/:id', itemController.updateItem);
app.delete('/api/items/:id', itemController.deleteItem);
// Legacy book routes (for backward compatibility with other services)
app.post('/api/books', itemController.createItem);
app.get('/api/books', itemController.getAllItems);
app.get('/api/books/available', itemController.getAvailableItems);
app.get('/api/books/:id', itemController.getItemById);
app.put('/api/books/:id', itemController.updateItem);
app.delete('/api/books/:id', itemController.deleteItem);
// Member routes
app.post('/api/members', memberController.createMember);
app.get('/api/members', memberController.getAllMembers);
app.get('/api/members/student/:studentId', memberController.getMemberByStudentId);
app.get('/api/members/:id', memberController.getMemberById);
app.put('/api/members/:id', memberController.updateMember);
app.delete('/api/members/:id', memberController.deleteMember);
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
