# MGNREGA Performance Tracker - Deployment Guide

This guide covers deploying the MGNREGA Performance Tracker on various free hosting platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended for Full-Stack Apps)

**Best for**: Full-stack applications with database requirements

1. **Sign up at [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Deploy automatically** - Railway will detect the project structure
4. **Add environment variables**:
   ```
   NODE_ENV=production
   DATA_GOV_API_KEY=your-api-key-here
   ```
5. **Your app will be live at**: `https://your-app-name.railway.app`

**Advantages**:
- ✅ Free tier with 500 hours/month
- ✅ Built-in database support
- ✅ Automatic deployments
- ✅ Custom domains
- ✅ Persistent storage

### Option 2: Render.com

**Best for**: Full-stack applications with persistent storage

1. **Sign up at [Render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure build settings**:
   - Build Command: `npm run install-all && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`
5. **Add environment variables**:
   ```
   NODE_ENV=production
   DATA_GOV_API_KEY=your-api-key-here
   ```
6. **Deploy**

**Advantages**:
- ✅ Free tier available
- ✅ Persistent disk storage
- ✅ Automatic SSL
- ✅ Custom domains

### Option 3: Vercel (Frontend + Serverless)

**Best for**: Static sites with serverless functions

1. **Sign up at [Vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure project settings**:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `client/build`
4. **Deploy**

**Advantages**:
- ✅ Excellent performance
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Serverless functions

### Option 4: Netlify (Frontend + Serverless)

**Best for**: Static sites with serverless functions

1. **Sign up at [Netlify.com](https://netlify.com)**
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Build Command: `npm run build`
   - Publish Directory: `client/build`
4. **Deploy**

**Advantages**:
- ✅ Free tier with generous limits
- ✅ Form handling
- ✅ Serverless functions
- ✅ Branch previews

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=production
PORT=5000
DATA_GOV_API_KEY=your-data-gov-api-key-here
```

### 2. Database Initialization

The application will automatically create the SQLite database and populate it with sample data on first run.

### 3. Build the Application

```bash
# Install all dependencies
npm run install-all

# Build the frontend
npm run build
```

## 📱 Mobile Optimization

The application is already optimized for mobile devices with:
- Responsive design
- Touch-friendly interface
- Low bandwidth optimization
- Offline capability (with service workers)

## 🌐 Custom Domain Setup

### Railway
1. Go to your project dashboard
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Render
1. Go to your service dashboard
2. Click on "Settings" → "Custom Domains"
3. Add your domain
4. Update DNS records

### Vercel/Netlify
1. Go to your project dashboard
2. Click on "Domains"
3. Add your custom domain
4. Update DNS records

## 🔍 Monitoring and Analytics

### Health Checks
- Backend: `https://your-app.com/health`
- Frontend: `https://your-app.com/`

### Performance Monitoring
- Railway: Built-in metrics
- Render: Built-in metrics
- Vercel: Built-in analytics
- Netlify: Built-in analytics

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Ensure all dependencies are installed
   - Check for syntax errors

2. **Database Issues**
   - Ensure SQLite is supported on your platform
   - Check file permissions
   - Verify database initialization

3. **API Issues**
   - Check environment variables
   - Verify API endpoints
   - Check rate limiting

### Debug Commands

```bash
# Check if the app builds locally
npm run build

# Test the backend
curl http://localhost:5000/health

# Test the frontend
curl http://localhost:3000
```

## 📊 Performance Optimization

### Production Optimizations Applied:
- ✅ Gzip compression
- ✅ Static file caching
- ✅ Database indexing
- ✅ Rate limiting
- ✅ Security headers
- ✅ Error handling
- ✅ Health checks

## 🔒 Security Features

- HTTPS enforcement
- Security headers (CSP, HSTS, etc.)
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection

## 📈 Scaling Considerations

### Free Tier Limits:
- **Railway**: 500 hours/month, 1GB RAM
- **Render**: 750 hours/month, 512MB RAM
- **Vercel**: 100GB bandwidth/month
- **Netlify**: 100GB bandwidth/month

### Upgrade Paths:
- Railway: $5/month for unlimited hours
- Render: $7/month for always-on
- Vercel: $20/month for Pro features
- Netlify: $19/month for Pro features

## 🎯 Recommended Deployment Strategy

For the MGNREGA Performance Tracker, I recommend:

1. **Primary**: Railway (for full-stack with database)
2. **Backup**: Render.com (for redundancy)
3. **CDN**: Cloudflare (for global performance)

This combination provides:
- Reliable hosting
- Database persistence
- Global performance
- Cost-effective scaling

## 📞 Support

If you encounter issues during deployment:

1. Check the platform's documentation
2. Review the application logs
3. Test locally first
4. Contact platform support

## 🎉 Success!

Once deployed, your MGNREGA Performance Tracker will be accessible to millions of rural Indians, providing transparent access to government program performance data.

**Live URL**: `https://your-app-name.platform.com`


