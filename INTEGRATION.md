# Frontend-Backend Integration Guide

This document explains how the React frontend integrates with your Flask backend API.

## 🔄 Integration Status

✅ **API Endpoints Integrated:**
- `GET /health` - Health check
- `POST /run-once` - Immediate scan
- `POST /schedule` - Schedule recurring scans
- `GET /jobs` - List scheduled jobs
- `DELETE /jobs/{job_id}` - Remove scheduled job

## 🚀 Quick Start

1. **Start your Flask backend** on port 8000:
   ```bash
   # Your backend should be running on http://localhost:8000
   ```

2. **Start the React frontend**:
   ```bash
   npm start
   ```

3. **Test the connection**:
   - Open http://localhost:3000
   - Check the health status indicator at the top of the dashboard
   - Click "Test Scan" to verify backend integration

## 📡 API Integration Details

### Health Check
```typescript
// Checks if backend is running
const response = await scanService.checkHealth();
// Expected: { "status": "ok" }
```

### Immediate Scan
```typescript
const response = await scanService.runImmediateScan(
  'user@example.com',
  'https://website.com'
);
// Returns: { job_id: "uuid", message: "..." }
```

### Schedule Recurring Scan
```typescript
const response = await scanService.scheduleScan({
  email: 'user@example.com',
  url: 'https://website.com',
  schedule: {
    type: 'cron',
    cron: {
      minute: '0',
      hour: '9',
      day_of_week: 'mon-fri'
    },
    timezone: 'UTC'
  }
});
```

## 🎯 Frontend Features

### 1. Dashboard
- **Health Check**: Shows backend connection status
- **Test Button**: Quick test scan functionality
- **Statistics**: Job counts and summary (mocked for now)
- **Recent Jobs**: List of scheduled jobs

### 2. New Scan Form
- **Immediate Scans**: Run scan right away
- **Scheduled Scans**: Multiple scheduling options:
  - **Cron**: Traditional cron expressions (minute, hour, day_of_week)
  - **Interval**: Run every X minutes/hours/days
  - **One-time**: Run at specific date/time
- **Timezone Support**: Multiple timezone options

### 3. Job Management
- **List Jobs**: View all scheduled jobs
- **Delete Jobs**: Remove scheduled jobs
- **Trigger Immediate**: Convert scheduled job to immediate run

## 🔧 Configuration

### Environment Variables
```bash
# .env
REACT_APP_API_URL=http://localhost:8000  # For production
# In development, uses proxy to avoid CORS
```

### Development Proxy
The frontend includes a proxy configuration in `package.json`:
```json
{
  "proxy": "http://localhost:8000"
}
```

This eliminates CORS issues during development.

## 📝 Data Flow Examples

### Creating a Daily Scan
1. User fills out form with email, URL, and cron schedule
2. Frontend calls `POST /schedule` with:
   ```json
   {
     "email": "team@company.com",
     "url": "https://app.company.com",
     "schedule": {
       "type": "cron",
       "cron": {
         "minute": "0",
         "hour": "9",
         "day_of_week": "mon-fri"
       },
       "timezone": "America/New_York"
     }
   }
   ```
3. Backend returns job ID
4. Frontend shows success message and redirects to job list

### Running Immediate Scan
1. User selects "Run Immediately" option
2. Frontend calls `POST /run-once` with email and URL
3. Backend queues the job
4. User receives email with results when complete

## 🐛 Error Handling

The frontend includes comprehensive error handling:

- **Network Errors**: "Network error - check if the API server is running"
- **API Errors**: Shows the exact error message from backend
- **Validation Errors**: Form validation before API calls
- **Health Checks**: Visual indicators for backend status

## 🔮 Future Enhancements

Ready for when backend implements:

1. **Scan Results Endpoint**: `GET /jobs/{job_id}/result`
2. **Job History**: `GET /jobs/{job_id}/runs`
3. **User Management**: Authentication endpoints
4. **Webhooks**: Real-time status updates

## 🧪 Testing

### Manual Testing
1. **Health Check**: Dashboard should show green status
2. **Immediate Scan**: Use test button or create new immediate scan
3. **Scheduled Scan**: Create cron/interval job and verify in jobs list
4. **Error Cases**: Stop backend and verify error messages

### API Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test immediate scan
curl -X POST http://localhost:8000/run-once \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "url": "https://example.com"}'

# Test scheduling
curl -X POST http://localhost:8000/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "url": "https://example.com",
    "schedule": {
      "type": "interval",
      "interval": {"hours": 2}
    }
  }'
```

## 📞 Troubleshooting

### Common Issues

**"Network error"**
- Ensure backend is running on port 8000
- Check proxy configuration in package.json

**"CORS error" (in production)**
- Configure CORS in your Flask backend
- Or use the proxy configuration

**"Invalid schedule format"**
- Check the schedule object matches expected format
- Verify timezone values are valid

**Form validation errors**
- Ensure email format is valid
- URL must include protocol (https://)
- Future dates only for scheduled scans

### Debug Mode
Set `REACT_APP_ENABLE_DEBUG=true` in `.env` for additional logging.
