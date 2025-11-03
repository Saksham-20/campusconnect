#!/bin/bash

# Hostinger KVM1 Quick Setup Script
# Run this script as root: sudo bash setup-hostinger.sh

set -e

echo "🚀 Starting Hostinger KVM1 Setup..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install basic tools
echo -e "${YELLOW}📦 Installing basic tools...${NC}"
apt install -y git curl wget nano ufw fail2ban htop

# Set up firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5000/tcp
ufw --force enable

# Install Node.js 20.x
echo -e "${YELLOW}📦 Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify Node.js
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker

# Install Docker Compose
apt install -y docker-compose-plugin

# Verify Docker
DOCKER_VERSION=$(docker --version)
echo -e "${GREEN}✅ Docker installed: $DOCKER_VERSION${NC}"

# Install PostgreSQL
echo -e "${YELLOW}🐘 Installing PostgreSQL...${NC}"
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Install Redis
echo -e "${YELLOW}📦 Installing Redis...${NC}"
apt install -y redis-server
systemctl start redis-server
systemctl enable redis-server

# Install Nginx
echo -e "${YELLOW}🌐 Installing Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Install PM2
echo -e "${YELLOW}⚙️ Installing PM2...${NC}"
npm install -g pm2

# Install Certbot
echo -e "${YELLOW}🔒 Installing Certbot for SSL...${NC}"
apt install -y certbot python3-certbot-nginx

# Set up MinIO
echo -e "${YELLOW}📦 Installing MinIO...${NC}"
wget https://dl.min.io/server/minio/release/linux-amd64/minio -O /usr/local/bin/minio
chmod +x /usr/local/bin/minio
mkdir -p /mnt/minio/data /mnt/minio/config

# Create MinIO service
cat > /etc/systemd/system/minio.service << 'EOF'
[Unit]
Description=MinIO Object Storage
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/minio server /mnt/minio/data --console-address ":9001"
Restart=always
RestartSec=10

Environment="MINIO_ROOT_USER=admin"
Environment="MINIO_ROOT_PASSWORD=ChangeThisPassword123!"

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable minio
echo -e "${YELLOW}⚠️  MinIO installed but not started. Please configure MINIO_ROOT_PASSWORD in /etc/systemd/system/minio.service before starting${NC}"

# Create project directory
mkdir -p /var/www

echo ""
echo -e "${GREEN}✅ Basic setup completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Set PostgreSQL password: sudo -u postgres psql -c \"ALTER USER postgres PASSWORD 'your-password';\""
echo "2. Create database: sudo -u postgres psql -c \"CREATE DATABASE edumapping_prod;\""
echo "3. Configure MinIO password in /etc/systemd/system/minio.service"
echo "4. Start MinIO: systemctl start minio"
echo "5. Clone your project to /var/www/campusconnect"
echo "6. Configure environment variables"
echo "7. Deploy your application"
echo ""
echo "See DEPLOYMENT_HOSTINGER.md for detailed instructions."

