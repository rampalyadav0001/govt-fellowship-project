# MGNREGA Performance Tracker - Separate Deployment Guide

## 🎯 Deployment Architecture

Your MGNREGA Performance Tracker is now configured for **separate deployments**:

- **Backend API**: Deploy on **Render.com** 
- **Frontend**: Deploy on **Vercel**
- **Database**: SQLite on Render (persistent storage)

## 🚀 Backend Deployment (Render.com)

### Step 1: Deploy Backend

1. **Go to [render.com](https://render.com)**
2. **Sign up/login with GitHub**
3. **Click "New" → "Web Service"**
4. **Connect your repository**: `rampalyadav0001/govt-fellowship-project`
5. **Configure settings**:
   - **Name**: `mgnrega-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty
6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DATA_GOV_API_KEY=your-data-gov-api-key-here
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
7. **Click "Create Web Service"**

### Step 2: Backend Configuration

Your backend is configured with:
- ✅ **API-only server** (no static files)
- ✅ **CORS enabled** for frontend domain
- ✅ **Health check** endpoint at `/health`
- ✅ **API info** endpoint at `/api/info`
- ✅ **Persistent database** storage

### Step 3: Backend URLs

After deployment, your backend will be available at:
- **API Base URL**: `https://mgnrega-backend.onrender.com`
- **Health Check**: `https://mgnrega-backend.onrender.com/health`
- **API Info**: `https://mgnrega-backend.onrender.com/api/info`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy Frontend

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/login with GitHub**
3. **Click "New Project"**
4. **Import your repository**: `rampalyadav0001/govt-fellowship-project`
5. **Configure project settings**:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://mgnrega-backend.onrender.com
   ```
7. **Click "Deploy"**

### Step 2: Frontend Configuration

Your frontend is configured with:
- ✅ **Environment-based API URL**
- ✅ **Axios configuration** with base URL
- ✅ **Error handling** and logging
- ✅ **Responsive design** for mobile

### Step 3: Frontend URLs

After deployment, your frontend will be available at:
- **Frontend URL**: `https://your-app-name.vercel.app`
- **All routes** will be handled by React Router

## 🔧 Environment Variables Setup

### Backend (Render.com)
```
NODE_ENV=production
PORT=10000
DATA_GOV_API_KEY=your-actual-api-key-here
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://mgnrega-backend.onrender.com
```

## 📋 Deployment Checklist

### Backend Deployment:
- [ ] Repository connected to Render
- [ ] Build command: `cd server && npm install`
- [ ] Start command: `cd server && npm start`
- [ ] Environment variables set
- [ ] Health check working: `/health`
- [ ] API endpoints accessible

### Frontend Deployment:
- [ ] Repository connected to Vercel
- [ ] Root directory: `./client`
- [ ] Build command: `npm run build`
- [ ] Environment variables set
- [ ] API URL pointing to backend
- [ ] Frontend accessible

## 🧪 Testing Your Deployment

### Test Backend:
```bash
# Health check
curl https://mgnrega-backend.onrender.com/health

# API info
curl https://mgnrega-backend.onrender.com/api/info

# Districts endpoint
curl https://mgnrega-backend.onrender.com/api/districts
```

### Test Frontend:
1. **Visit your Vercel URL**
2. **Check browser console** for API calls
3. **Test all pages** (Home, District Performance, Compare)
4. **Verify data loading** from backend

## 🔄 Development Workflow

### Local Development:
1. **Start backend**: `cd server && npm run dev`
2. **Start frontend**: `cd client && npm start`
3. **Frontend will use**: `http://localhost:5000` (from api.js config)

### Production Updates:
1. **Push changes** to GitHub
2. **Render auto-deploys** backend
3. **Vercel auto-deploys** frontend
4. **Both services** update automatically

## 🎯 Benefits of Separate Deployment

- ✅ **Independent scaling** - Scale frontend and backend separately
- ✅ **Better performance** - Frontend served from global CDN
- ✅ **Easier maintenance** - Update frontend without affecting backend
- ✅ **Cost optimization** - Use free tiers efficiently
- ✅ **Better monitoring** - Separate logs and metrics

## 🚨 Troubleshooting

### Backend Issues:
- **Check Render logs** for startup errors
- **Verify environment variables** are set correctly
- **Test health endpoint** manually
- **Check database initialization**

### Frontend Issues:
- **Check Vercel build logs** for build errors
- **Verify API URL** environment variable
- **Check browser console** for API errors
- **Test API endpoints** directly

### CORS Issues:
- **Update FRONTEND_URL** in backend environment
- **Check CORS configuration** in server/index.js
- **Verify domain** matches exactly

## 📊 Monitoring

### Backend Monitoring (Render):
- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory, Response time
- **Health checks**: Automatic monitoring
- **Uptime**: 99.9% SLA

### Frontend Monitoring (Vercel):
- **Analytics**: Built-in performance metrics
- **Logs**: Function logs available
- **Uptime**: 99.99% SLA
- **Performance**: Core Web Vitals

## 🎉 Success!

Once both deployments are complete:

1. **Backend**: `https://mgnrega-backend.onrender.com`
2. **Frontend**: `https://your-app-name.vercel.app`
3. **Full app**: Working with separate services
4. **Auto-deployment**: Updates on every git push

Your MGNREGA Performance Tracker is now deployed with a modern, scalable architecture! 🇮🇳
