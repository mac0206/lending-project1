# MongoDB Connection Setup

## Overview

All backend services now include robust MongoDB connection handling with clear status messages.

## Features

✅ **Connection Verification**: Services wait for MongoDB connection before starting
✅ **Clear Status Messages**: Visual indicators show connection status
✅ **Error Handling**: Helpful error messages if MongoDB is unavailable
✅ **Graceful Shutdown**: Proper cleanup on service termination

## Connection Status Indicators

When you run `npm run dev`, you'll see:

### ✅ Success Messages:
```
[Catalog Service] Connecting to MongoDB...
[Catalog Service] URI: mongodb://localhost:27017/library-system
[Catalog Service] ✅ MongoDB connected successfully
[Catalog Service] Database: library-system
[Catalog Service] ✅ MongoDB connection verified

🚀 Catalog Service is running on port 3001
📡 Health check: http://localhost:3001/health
```

### ❌ Error Messages:
```
[Catalog Service] Connecting to MongoDB...
[Catalog Service] ❌ Failed to connect to MongoDB: connect ECONNREFUSED
[Catalog Service] Please ensure MongoDB is running and accessible

❌ Catalog Service failed to start: connect ECONNREFUSED
Please check your MongoDB connection and try again.
```

## MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB** (if not already installed):
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB**:
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   mongod
   ```

3. **Verify MongoDB is running**:
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Create a cluster and get your connection string

3. Update `.env` files with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-system
   ```

## Troubleshooting

### MongoDB Not Running

**Error**: `connect ECONNREFUSED` or `MongoServerSelectionError`

**Solution**:
1. Check if MongoDB is running:
   ```bash
   # Windows
   sc query MongoDB

   # macOS/Linux
   ps aux | grep mongod
   ```

2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   # or
   mongod --dbpath /path/to/data
   ```

### Connection Timeout

**Error**: `MongoServerSelectionError: Server selection timed out`

**Solution**:
1. Check MongoDB is accessible on the configured port (default: 27017)
2. Verify firewall settings
3. Check MongoDB logs for errors
4. For Atlas: Verify IP whitelist includes your IP address

### Authentication Failed

**Error**: `Authentication failed`

**Solution**:
1. Verify username and password in connection string
2. Check user permissions in MongoDB
3. For Atlas: Verify database user credentials

### Wrong Database Name

**Error**: Connection succeeds but collections not found

**Solution**:
1. Verify database name in connection string matches your setup
2. Check if database exists: `show dbs` in MongoDB shell
3. Collections will be created automatically on first use

## Connection String Format

### Local MongoDB:
```
mongodb://localhost:27017/library-system
```

### MongoDB Atlas:
```
mongodb+srv://username:password@cluster.mongodb.net/library-system?retryWrites=true&w=majority
```

### With Authentication:
```
mongodb://username:password@localhost:27017/library-system?authSource=admin
```

## Environment Variables

Each service uses its own `.env` file:

- `backend/catalog-service/.env`
- `backend/circulation-service/.env`
- `backend/reporting-service/.env`

All should have:
```env
MONGODB_URI=mongodb://localhost:27017/library-system
```

## Health Check Endpoints

Once services are running, you can check MongoDB connection status:

```bash
# Catalog Service
curl http://localhost:3001/health

# Circulation Service
curl http://localhost:3002/health

# Reporting Service
curl http://localhost:3003/health
```

Response includes database connection status:
```json
{
  "status": "ok",
  "service": "catalog-service",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

## Best Practices

1. **Always start MongoDB before services**: Services will exit if MongoDB is unavailable
2. **Use environment variables**: Never commit `.env` files with credentials
3. **Monitor connection status**: Use health check endpoints in production
4. **Handle reconnections**: Services automatically handle connection events
5. **Graceful shutdown**: Use Ctrl+C to properly disconnect from MongoDB

