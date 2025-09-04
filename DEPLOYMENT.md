# Deployment Guide

## The Issue
The error `sh: 1: nodemon: Permission denied` occurs because your deployment platform is trying to run `npm run dev` (which uses nodemon) instead of `npm start` (which uses regular node).

## Solutions

### For Render.com
1. Use the included `render.yaml` file in the root directory
2. Or manually configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - Set environment variable `NODE_ENV=production`

### For Heroku
1. Use the included `Procfile` in the backend directory
2. Set environment variables:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=your_frontend_url
   ```

### For Other Platforms
Ensure your deployment platform runs:
- **Install**: `npm install`
- **Start**: `npm start` (NOT `npm run dev`)

## Environment Variables Required
- `NODE_ENV=production`
- `MONGO_URI=mongodb+srv://saikrishnabalaka_db_user:Saikrishn%407@cluster0.uqyesid.mongodb.net/MY-API-PLAYGROUND?retryWrites=true&w=majority`
- `JWT_SECRET=MY-API-PLAYGROUND-super-secret-jwt-key-2024-development`
- `CLIENT_URL` - Your frontend URL for CORS
- `PORT` - Will be set automatically by most platforms

## MongoDB Atlas IP Whitelist Issue
If you see "MongooseServerSelectionError: Could not connect to any servers", your deployment server's IP isn't whitelisted:

1. Go to MongoDB Atlas Dashboard → Network Access
2. Click "Add IP Address" 
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Or add specific Render.com IPs: 216.24.57.1/32, 216.24.57.4/32, 216.24.57.5/32

## Files Added/Modified
- ✅ Fixed missing `path` import in `server.js`
- ✅ Moved `nodemon` to regular dependencies for compatibility
- ✅ Created `render.yaml` for Render deployment
- ✅ Created `Procfile` for Heroku deployment
- ✅ Created `.env.example` for reference

## Next Steps
1. Configure your deployment platform to use `npm start`
2. Set the required environment variables
3. Redeploy your application
