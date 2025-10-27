# MGNREGA Performance Tracker - Docker Deployment Guide

## 🐳 Docker Deployment Options

Your application is fully Dockerized with:
- ✅ Multi-stage build for optimization
- ✅ PM2 process management
- ✅ Nginx reverse proxy
- ✅ Health checks and monitoring
- ✅ Security headers and rate limiting

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/rampalyadav0001/govt-fellowship-project)

**Steps:**
1. Click the Railway button above
2. Sign up with GitHub
3. Select your repository
4. Railway will auto-detect your Dockerfile
5. Add environment variables
6. Deploy!

### Option 2: Render.com
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/rampalyadav0001/govt-fellowship-project)

**Steps:**
1. Click the Render button above
2. Sign up with GitHub
3. Create new Web Service
4. Select "Docker" as environment
5. Add environment variables
6. Deploy!

### Option 3: DigitalOcean App Platform
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app
3. Connect GitHub repository
4. Select "Docker" as source type
5. Configure environment variables
6. Deploy!

### Option 4: Google Cloud Run
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Cloud Run API
3. Deploy from source:
   ```bash
   gcloud run deploy --source . --platform managed --region us-central1
   ```

### Option 5: AWS App Runner
1. Go to [AWS App Runner](https://console.aws.amazon.com/apprunner)
2. Create service
3. Connect GitHub repository
4. Configure Docker settings
5. Deploy!

## 🔧 Environment Variables

Set these environment variables in your deployment platform:

```
NODE_ENV=production
DATA_GOV_API_KEY=your-data-gov-api-key-here
```

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Dockerfile is in root directory
- [ ] Environment variables configured
- [ ] API keys obtained
- [ ] Domain name ready (optional)

## 🧪 Local Testing

Test your Docker setup locally:

```bash
# Build the image
docker build -t mgnrega-tracker .

# Run the container
docker run -d -p 5000:5000 \
  -e NODE_ENV=production \
  -e DATA_GOV_API_KEY=test-key \
  mgnrega-tracker

# Test health endpoint
curl http://localhost:5000/health

# Stop container
docker stop $(docker ps -q --filter ancestor=mgnrega-tracker)
```

## 🎯 Recommended Platform: Railway

**Why Railway for Docker:**
- ✅ **Free tier**: 500 hours/month
- ✅ **Automatic Docker builds**
- ✅ **Persistent storage** for database
- ✅ **Custom domains**
- ✅ **Easy environment variable management**
- ✅ **Built-in monitoring**

## 📊 Performance Features

Your Dockerized app includes:
- **Multi-stage build**: Smaller production image
- **PM2**: Process management and clustering
- **Nginx**: Reverse proxy with caching
- **Health checks**: Automatic monitoring
- **Security headers**: XSS, CSRF protection
- **Rate limiting**: API protection
- **Gzip compression**: Faster loading

## 🌐 Custom Domain Setup

After deployment, you can add a custom domain:

1. **Railway**: Settings → Domains → Add domain
2. **Render**: Settings → Custom Domains → Add domain
3. **DigitalOcean**: Settings → Domains → Add domain

## 🔍 Monitoring

Monitor your deployed application:
- **Health endpoint**: `https://your-app.com/health`
- **Logs**: Available in platform dashboard
- **Metrics**: Built-in performance monitoring
- **Uptime**: Automatic health checks

## 🚨 Troubleshooting

### Common Issues:
1. **Build failures**: Check Dockerfile syntax
2. **Container crashes**: Check environment variables
3. **Database issues**: Ensure persistent storage
4. **API errors**: Verify API keys

### Debug Commands:
```bash
# Check container logs
docker logs container-name

# Inspect container
docker inspect container-name

# Test health endpoint
curl -f https://your-app.com/health
```

## 🎉 Success!

Once deployed, your MGNREGA Performance Tracker will be:
- ✅ **Production-ready** with Docker
- ✅ **Scalable** with PM2 clustering
- ✅ **Secure** with Nginx and security headers
- ✅ **Monitored** with health checks
- ✅ **Fast** with caching and compression

**Your app will be live at**: `https://your-app-name.platform.com`
