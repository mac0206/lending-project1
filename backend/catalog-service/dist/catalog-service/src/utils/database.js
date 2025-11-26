"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async (uri, serviceName) => {
    try {
        // Set connection options
        const options = {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000,
        };
        console.log(`[${serviceName}] Connecting to MongoDB...`);
        console.log(`[${serviceName}] URI: ${uri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
        // Connect to MongoDB
        await mongoose_1.default.connect(uri, options);
        // Connection event listeners
        mongoose_1.default.connection.on('connected', () => {
            console.log(`[${serviceName}] ✅ MongoDB connected successfully`);
            console.log(`[${serviceName}] Database: ${mongoose_1.default.connection.db?.databaseName}`);
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.error(`[${serviceName}] ❌ MongoDB connection error:`, err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn(`[${serviceName}] ⚠️  MongoDB disconnected`);
        });
        // Verify connection
        if (mongoose_1.default.connection.readyState === 1) {
            console.log(`[${serviceName}] ✅ MongoDB connection verified`);
            return;
        }
        else {
            throw new Error('MongoDB connection not established');
        }
    }
    catch (error) {
        console.error(`[${serviceName}] ❌ Failed to connect to MongoDB:`, error.message);
        console.error(`[${serviceName}] Please ensure MongoDB is running and accessible`);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async (serviceName) => {
    try {
        await mongoose_1.default.disconnect();
        console.log(`[${serviceName}] MongoDB disconnected`);
    }
    catch (error) {
        console.error(`[${serviceName}] Error disconnecting from MongoDB:`, error.message);
    }
};
exports.disconnectDatabase = disconnectDatabase;
