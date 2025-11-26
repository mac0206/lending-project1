# Backend Service Integration Guide

This document describes the API-based integration between the three microservices.

## Service Architecture

```
┌─────────────────┐
│ Catalog Service │ (Port 3001)
│  - Books        │
│  - Members      │
└────────┬────────┘
         │
         │ HTTP API Calls
         │
┌────────▼────────┐         ┌─────────────────┐
│Circulation      │─────────▶│ Reporting        │
│Service          │  HTTP    │ Service          │
│(Port 3002)      │  API     │ (Port 3003)      │
│  - Loans        │          │  - Dashboard     │
│  - Returns      │          │  - Statistics    │
└─────────────────┘          └─────────────────┘
```

## API Integration Points

### 1. Circulation Service → Catalog Service

**Endpoints Used:**
- `GET /api/books/:id` - Check book availability
- `PUT /api/books/:id` - Update book availability
- `GET /api/members/:id` - Get member details
- `PUT /api/members/:id` - Update member borrowed items

**Integration Flow:**
1. **Creating a Loan:**
   - Check if book is available via Catalog Service
   - Create loan record in Circulation Service
   - Update book availability to `false` in Catalog Service
   - Add book ID to member's `borrowedItems` array in Catalog Service

2. **Returning a Book:**
   - Update loan status in Circulation Service
   - Update book availability to `true` in Catalog Service
   - Remove book ID from member's `borrowedItems` array in Catalog Service

### 2. Reporting Service → Catalog Service

**Endpoints Used:**
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book details
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member details

**Integration Flow:**
- Dashboard statistics: Fetches books and members from Catalog Service
- Most borrowed books: Gets loans from Circulation, then fetches book details from Catalog
- Borrowing history: Gets loans from Circulation, then fetches book and member details from Catalog
- Member statistics: Gets loans from Circulation, then fetches member details from Catalog

### 3. Reporting Service → Circulation Service

**Endpoints Used:**
- `GET /api/loans` - Get all loans
- `GET /api/loans/active` - Get active loans
- `GET /api/loans/overdue` - Get overdue loans
- `GET /api/loans/member/:memberId` - Get loans by member
- `GET /api/loans/book/:bookId` - Get loans by book

**Integration Flow:**
- Dashboard: Fetches active and overdue loans
- Statistics: Fetches all loans for analysis
- History: Fetches filtered loans based on criteria

## API Client Configuration

All services use a centralized `ApiClient` utility that provides:
- **Timeout**: 10 seconds for all requests
- **Logging**: Request/response logging with service names
- **Error Handling**: Comprehensive error handling with proper error messages
- **Interceptors**: Request and response interceptors for debugging

## Health Checks

### Service Health Endpoints

Each service provides a `/health` endpoint:
- `GET /health` - Returns service status and database connection state

### Dependency Health Checks

- **Circulation Service**: `GET /health/dependencies` - Checks Catalog Service
- **Reporting Service**: `GET /health/dependencies` - Checks Catalog and Circulation Services

## Error Handling

All API calls include:
1. **Try-Catch Blocks**: Proper error handling at service level
2. **HTTP Status Codes**: Appropriate status codes (404, 400, 500)
3. **Error Messages**: Descriptive error messages
4. **Rollback Logic**: Transaction rollback in loan creation if book update fails
5. **Graceful Degradation**: Services continue operating even if dependent services fail

## Environment Variables

### Catalog Service
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/library-system
```

### Circulation Service
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/library-system
CATALOG_SERVICE_URL=http://localhost:3001
```

### Reporting Service
```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/library-system
CATALOG_SERVICE_URL=http://localhost:3001
CIRCULATION_SERVICE_URL=http://localhost:3002
```

## Testing Integration

### Manual Testing

1. **Start all services:**
   ```bash
   npm run dev
   ```

2. **Check service health:**
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   curl http://localhost:3003/health
   ```

3. **Check dependencies:**
   ```bash
   curl http://localhost:3002/health/dependencies
   curl http://localhost:3003/health/dependencies
   ```

### Integration Test Flow

1. Create a book via Catalog Service
2. Create a member via Catalog Service
3. Create a loan via Circulation Service (should update book availability)
4. Check dashboard via Reporting Service (should show active loan)
5. Return book via Circulation Service (should update book availability)
6. Check statistics via Reporting Service (should show in history)

## Best Practices

1. **API Calls are Asynchronous**: All service-to-service calls use async/await
2. **Error Handling**: All API calls are wrapped in try-catch blocks
3. **Logging**: All API calls are logged for debugging
4. **Timeout**: 10-second timeout prevents hanging requests
5. **Idempotency**: Operations can be safely retried
6. **Data Consistency**: Rollback logic ensures data consistency

## Troubleshooting

### Service Not Responding
- Check if service is running on correct port
- Verify environment variables are set correctly
- Check MongoDB connection

### API Call Failures
- Check service logs for detailed error messages
- Verify service URLs in environment variables
- Use health check endpoints to verify service availability
- Check network connectivity between services

### Data Inconsistency
- Check if all services are using the same MongoDB database
- Verify rollback logic is working correctly
- Check for concurrent operations that might cause conflicts

