import mongoose from 'mongoose';

export const connectDatabase = async (uri: string, serviceName: string): Promise<void> => {
  try {
    // Set connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000,
    };

    console.log(`[${serviceName}] Connecting to MongoDB...`);
    console.log(`[${serviceName}] URI: ${uri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs

    // Connect to MongoDB
    await mongoose.connect(uri, options);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log(`[${serviceName}] ✅ MongoDB connected successfully`);
      console.log(`[${serviceName}] Database: ${mongoose.connection.db?.databaseName}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[${serviceName}] ❌ MongoDB connection error:`, err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`[${serviceName}] ⚠️  MongoDB disconnected`);
    });

    // Verify connection
    if (mongoose.connection.readyState === 1) {
      console.log(`[${serviceName}] ✅ MongoDB connection verified`);
      return;
    } else {
      throw new Error('MongoDB connection not established');
    }
  } catch (error: any) {
    console.error(`[${serviceName}] ❌ Failed to connect to MongoDB:`, error.message);
    console.error(`[${serviceName}] Please ensure MongoDB is running and accessible`);
    throw error;
  }
};

export const disconnectDatabase = async (serviceName: string): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log(`[${serviceName}] MongoDB disconnected`);
  } catch (error: any) {
    console.error(`[${serviceName}] Error disconnecting from MongoDB:`, error.message);
  }
};

