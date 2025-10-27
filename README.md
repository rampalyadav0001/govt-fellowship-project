# MGNREGA Performance Tracker

A production-ready web application for tracking MGNREGA district performance, designed for rural Indian citizens with low technical literacy.

## Features

- **User-Friendly Interface**: Designed for low-literacy rural population with visual indicators and simple navigation
- **Automatic Location Detection**: Detects user's district automatically using geolocation
- **District Performance Tracking**: View detailed performance metrics for any district
- **Comparative Analysis**: Compare performance between multiple districts
- **Production-Ready Architecture**: Built with scalability, caching, and fallback mechanisms
- **Responsive Design**: Works on mobile devices and low-bandwidth connections

## Technology Stack

### Frontend
- React 18 with modern hooks
- React Router for navigation
- Recharts for data visualization
- Lucide React for icons
- Responsive CSS with mobile-first design

### Backend
- Node.js with Express
- SQLite database for easy deployment
- Axios for API calls
- Node-cron for scheduled data updates
- Rate limiting and security middleware

### Production Features
- Data caching with fallback mechanisms
- Rate limiting and security headers
- Automatic data refresh every 6 hours
- Error handling and logging
- Health check endpoints

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mgnrega-performance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cd server
   cp env.example .env
   # Edit .env file with your API keys
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

## 🚀 Quick Deploy (Free Hosting)

### Option 1: Railway (Recommended)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_GITHUB_USERNAME/govt-fellowship-project)

### Option 2: Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR_GITHUB_USERNAME/govt-fellowship-project)

### Option 3: Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_GITHUB_USERNAME/govt-fellowship-project)

### Option 4: Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_GITHUB_USERNAME/govt-fellowship-project)

## 📖 Detailed Deployment Guide

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions.

## Production Deployment (VPS)

### Using PM2 (Recommended)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

3. **Start with PM2**
   ```bash
   cd server
   pm2 start index.js --name "mgnrega-tracker"
   pm2 save
   pm2 startup
   ```

### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t mgnrega-tracker .
   docker run -p 5000:5000 mgnrega-tracker
   ```

## API Endpoints

### Public Endpoints
- `GET /api/districts` - Get all districts
- `GET /api/performance/:districtCode` - Get district performance data
- `GET /api/district/:districtCode/summary` - Get district summary
- `GET /api/compare?districts=code1,code2` - Compare districts
- `GET /api/state-summary` - Get state-wise summary

### Admin Endpoints
- `POST /api/refresh-data` - Manually refresh data
- `GET /health` - Health check

## Database Schema

### Districts Table
- `id` - Primary key
- `district_code` - Unique district identifier
- `district_name` - District name
- `state_name` - State name
- `state_code` - State code

### Performance Data Table
- `id` - Primary key
- `district_code` - District identifier
- `month` - Month (1-12)
- `year` - Year
- `total_households` - Total households
- `total_persons` - Total persons
- `total_work_days` - Total work days
- `total_wages_paid` - Total wages paid
- `works_completed` - Works completed

## Design Principles

### For Rural Indian Citizens
- **Visual Indicators**: Use colors, icons, and charts instead of text-heavy content
- **Simple Language**: Avoid technical jargon, use Hindi/regional language support
- **Mobile-First**: Optimized for mobile devices and low bandwidth
- **Accessibility**: High contrast, large fonts, keyboard navigation
- **Offline Capability**: Works with limited internet connectivity

### Production Architecture
- **Caching Strategy**: Multi-layer caching with API fallbacks
- **Rate Limiting**: Prevent abuse and ensure fair usage
- **Error Handling**: Graceful degradation and user-friendly error messages
- **Monitoring**: Health checks and performance metrics
- **Security**: HTTPS, CORS, and input validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team or create an issue in the repository.
