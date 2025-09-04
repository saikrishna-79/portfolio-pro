# MY-API-PLAYGROUND - Setup Instructions

## 🚨 Quick Fix for Current Issues

The errors you're seeing are due to MongoDB connection and configuration issues. Here's how to fix them:

### 1. MongoDB Atlas Setup (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account and cluster

2. **Get Connection String**
   - In Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Environment Variables**
   ```bash
   # Edit backend/.env file
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/MY-API-PLAYGROUND?retryWrites=true&w=majority
   ```

### 2. Alternative: Local MongoDB Setup

If you prefer local MongoDB:

1. **Install MongoDB Community Edition**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for Windows

2. **Start MongoDB Service**
   ```bash
   # Start MongoDB service
   net start MongoDB
   ```

3. **Update Environment Variables**
   ```bash
   # Edit backend/.env file
   MONGO_URI=mongodb://localhost:27017/MY-API-PLAYGROUND
   ```

### 3. Clear Browser Storage (Fix JWT Issues)

The JWT signature errors are due to old tokens. Clear them:

1. **Open Browser Developer Tools** (F12)
2. **Go to Application/Storage tab**
3. **Clear localStorage** (or just remove 'token' entry)
4. **Refresh the page**

### 4. Start the Application

```bash
# Terminal 1: Start Backend
cd backend
npm install
npm run dev

# Terminal 2: Start Frontend  
cd frontend
npm install
npm start
```

## 🔧 Fixed Issues

✅ **Rate Limiting Error**: Added `trust proxy` configuration  
✅ **JWT Signature Error**: Updated JWT secret key  
✅ **Frontend API Calls**: Added axios baseURL configuration  
✅ **Project Structure**: Updated to match backend/frontend folders  

## 🎯 Test the Application

1. **Backend Health Check**: http://localhost:5000/api/health
2. **Frontend**: http://localhost:3000
3. **Register a new user** or use sample data after seeding

## 📊 Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

**Sample Login Credentials:**
- Email: `john.doe@example.com`
- Password: `password123`

## 🚀 Production Deployment

For production deployment, update the environment variables:

```env
NODE_ENV=production
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
```

## 📞 Need Help?

If you still encounter issues:
1. Check that MongoDB is running/accessible
2. Verify environment variables are correct
3. Clear browser cache and localStorage
4. Check console logs for specific errors
