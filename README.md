# MGNREGA Performance Tracker

A production-ready web application for tracking MGNREGA district performance, designed for rural Indian citizens with low technical literacy.

## 🎯 Deployment Architecture

This application uses **separate deployment** for optimal performance and scalability:

- **Backend API**: Deployed on **Render.com** 
- **Frontend**: Deployed on **Vercel**
- **Database**: SQLite with persistent storage

## Features

- **User-Friendly Interface**: Designed for low-literacy rural population with visual indicators and simple navigation
- **Automatic Location Detection**: Detects user's district automatically using geolocation
- **District Performance Tracking**: View detailed performance metrics for any district
- **Comparative Analysis**: Compare performance between multiple districts
- **Production-Ready Architecture**: Built with scalability, caching, and fallback mechanisms
- **Responsive Design**: Works on mobile devices and low-bandwidth connections

## Technology Stack

### Frontend (Vercel)
- React 18 with modern hooks
- React Router for navigation
- Recharts for data visualization
- Lucide React for icons
- Responsive CSS with mobile-first design

### Backend (Render)
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

## 🚀 Quick Deploy

### Backend (Render.com)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/rampalyadav0001/govt-fellowship-project)

### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rampalyadav0001/govt-fellowship-project)

## 📖 Detailed Deployment Guide

See [SEPARATE-DEPLOYMENT.md](SEPARATE-DEPLOYMENT.md) for comprehensive deployment instructions.

## Installation (Local Development)

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rampalyadav0001/govt-fellowship-project.git
   cd govt-fellowship-project
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
- `GET /api/info` - API information

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
