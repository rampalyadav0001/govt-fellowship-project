#!/bin/bash

# MGNREGA Performance Tracker Deployment Script
# This script deploys the application to a VPS

set -e

echo "🚀 Starting MGNREGA Performance Tracker Deployment..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root"
    exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Docker (optional)
echo "📦 Installing Docker..."
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/mgnrega-tracker
sudo chown $USER:$USER /opt/mgnrega-tracker
cd /opt/mgnrega-tracker

# Clone repository (replace with your actual repository URL)
echo "📥 Cloning repository..."
git clone https://github.com/yourusername/mgnrega-performance-tracker.git .

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build the application
echo "🔨 Building application..."
npm run build

# Create environment file
echo "⚙️ Setting up environment..."
cp server/env.example server/.env
echo "Please edit server/.env file with your API keys and configuration"

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'mgnrega-tracker',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Create logs directory
mkdir -p logs

# Start the application
echo "🚀 Starting application..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Install and configure Nginx
echo "🌐 Installing and configuring Nginx..."
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/mgnrega-tracker << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # API routes
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000;
        access_log off;
    }

    # Main application
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/mgnrega-tracker /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Set up SSL with Let's Encrypt (optional)
echo "🔒 Setting up SSL certificate..."
echo "To set up SSL, run: sudo certbot --nginx -d your-domain.com"

# Create systemd service for monitoring
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/mgnrega-tracker.service << EOF
[Unit]
Description=MGNREGA Performance Tracker
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=/opt/mgnrega-tracker
ExecStart=/usr/bin/pm2 start ecosystem.config.js
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable mgnrega-tracker

# Create backup script
echo "💾 Creating backup script..."
cat > backup.sh << EOF
#!/bin/bash
# Backup script for MGNREGA Tracker
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/mgnrega-tracker"
mkdir -p \$BACKUP_DIR

# Backup database
cp server/database/mgnrega_data.db \$BACKUP_DIR/mgnrega_data_\$DATE.db

# Backup logs
cp -r logs \$BACKUP_DIR/logs_\$DATE

# Keep only last 7 days of backups
find \$BACKUP_DIR -name "*.db" -mtime +7 -delete
find \$BACKUP_DIR -name "logs_*" -mtime +7 -exec rm -rf {} \;
EOF

chmod +x backup.sh

# Set up cron job for backups
echo "⏰ Setting up backup cron job..."
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/mgnrega-tracker/backup.sh") | crontab -

# Create monitoring script
echo "📊 Creating monitoring script..."
cat > monitor.sh << EOF
#!/bin/bash
# Simple monitoring script
echo "=== MGNREGA Tracker Status ==="
echo "Date: \$(date)"
echo "Uptime: \$(uptime)"
echo "Memory Usage: \$(free -h)"
echo "Disk Usage: \$(df -h /)"
echo "PM2 Status:"
pm2 status
echo "Nginx Status:"
sudo systemctl status nginx --no-pager
echo "Application Health:"
curl -s http://localhost:5000/health | jq . || echo "Health check failed"
EOF

chmod +x monitor.sh

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit /opt/mgnrega-tracker/server/.env with your API keys"
echo "2. Update your domain name in /etc/nginx/sites-available/mgnrega-tracker"
echo "3. Set up SSL certificate: sudo certbot --nginx -d your-domain.com"
echo "4. Test the application: curl http://localhost:5000/health"
echo "5. Monitor with: ./monitor.sh"
echo ""
echo "🌐 Your application should be accessible at:"
echo "   http://your-domain.com"
echo ""
echo "📊 Monitor the application:"
echo "   pm2 status"
echo "   pm2 logs mgnrega-tracker"
echo "   ./monitor.sh"
