    #!/bin/bash

    # ==============================
    # EduMapping Deployment Script
    # Hostinger KVM1 - Ubuntu 22.04 LTS
    # ==============================

    set -e  # Exit on error

    echo "🚀 Starting EduMapping Deployment..."

    # Colors for output
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color

    # --- Configuration Variables ---
    DB_NAME="edumapping_prod"
    DB_USER="edumapping_user"
    DB_PASS=""  # Will be generated if empty
    DOMAIN_NAME="edumapping.in"  # CHANGE THIS to your domain

    # Generate random password if not set
    if [ -z "$DB_PASS" ]; then
        DB_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
        echo -e "${YELLOW}📝 Generated database password: $DB_PASS${NC}"
        echo -e "${YELLOW}⚠️  Save this password securely!${NC}"
    fi

    # Generate JWT secrets
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)

    echo -e "${BLUE}📋 Configuration:${NC}"
    echo "  Database: $DB_NAME"
    echo "  DB User: $DB_USER"
    echo "  Domain: $DOMAIN_NAME"
    echo ""

    # --- Update System ---
    echo -e "${YELLOW}📦 Updating system packages...${NC}"
    sudo apt update && sudo apt upgrade -y

    # --- Install Dependencies ---
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    sudo apt install -y nodejs npm git nginx postgresql postgresql-contrib curl ufw redis-server

    # Install Node.js 20.x (required for your project)
    echo -e "${YELLOW}📦 Installing Node.js 20.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs

    # Verify Node.js version
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"

    # --- Enable Firewall ---
    echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
    sudo ufw allow OpenSSH
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 5000/tcp  # Backend API (if needed externally)
    sudo ufw --force enable

    # --- Setup PostgreSQL ---
    echo -e "${YELLOW}🐘 Setting up PostgreSQL...${NC}"
    sudo systemctl enable postgresql
    sudo systemctl start postgresql

    # Create database and user
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists"
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';" 2>/dev/null || echo "User already exists"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

    echo -e "${GREEN}✅ PostgreSQL configured${NC}"

    # --- Setup Redis ---
    echo -e "${YELLOW}📦 Configuring Redis...${NC}"
    sudo systemctl enable redis-server
    sudo systemctl start redis-server

    # Test Redis
    redis-cli ping > /dev/null && echo -e "${GREEN}✅ Redis is running${NC}" || echo -e "${RED}❌ Redis failed to start${NC}"

    # --- Setup MinIO (File Storage) ---
    echo -e "${YELLOW}📦 Installing MinIO...${NC}"
    wget -q https://dl.min.io/server/minio/release/linux-amd64/minio -O /tmp/minio
    sudo mv /tmp/minio /usr/local/bin/minio
    sudo chmod +x /usr/local/bin/minio

    # Create MinIO directories
    sudo mkdir -p /mnt/minio/data /mnt/minio/config

    # Generate MinIO credentials
    MINIO_ROOT_USER="admin"
    MINIO_ROOT_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)

    # Create MinIO service
    sudo tee /etc/systemd/system/minio.service > /dev/null <<EOF
    [Unit]
    Description=MinIO Object Storage
    After=network.target

    [Service]
    Type=simple
    User=root
    ExecStart=/usr/local/bin/minio server /mnt/minio/data --console-address ":9001"
    Restart=always
    RestartSec=10

    Environment="MINIO_ROOT_USER=$MINIO_ROOT_USER"
    Environment="MINIO_ROOT_PASSWORD=$MINIO_ROOT_PASSWORD"

    [Install]
    WantedBy=multi-user.target
    EOF

    sudo systemctl daemon-reload
    sudo systemctl enable minio
    sudo systemctl start minio

    echo -e "${GREEN}✅ MinIO installed and running${NC}"
    echo -e "${YELLOW}📝 MinIO Console: http://$(hostname -I | awk '{print $1}'):9001${NC}"
    echo -e "${YELLOW}📝 MinIO Root User: $MINIO_ROOT_USER${NC}"
    echo -e "${YELLOW}📝 MinIO Root Password: $MINIO_ROOT_PASSWORD${NC}"

    # --- Clone or Prepare Project ---
    echo -e "${YELLOW}📁 Setting up project directory...${NC}"
    PROJECT_DIR="/var/www/campusconnect"

    if [ -d "$PROJECT_DIR" ]; then
        echo -e "${YELLOW}⚠️  Project directory exists. Updating...${NC}"
        cd $PROJECT_DIR
        git pull || echo "Not a git repo or unable to pull"
    else
        echo -e "${YELLOW}⚠️  Project directory not found.${NC}"
        echo -e "${YELLOW}   Please upload your project to $PROJECT_DIR${NC}"
        echo -e "${YELLOW}   Or clone it: git clone https://github.com/yourusername/campusconnect.git $PROJECT_DIR${NC}"
        echo ""
        read -p "Press Enter after uploading/cloning your project..."
    fi

    # Verify project structure
    if [ ! -d "$PROJECT_DIR/server" ] || [ ! -d "$PROJECT_DIR/client" ]; then
        echo -e "${RED}❌ Invalid project structure. Expected server/ and client/ directories.${NC}"
        exit 1
    fi

    cd $PROJECT_DIR

    # --- Setup Backend ---
    echo -e "${YELLOW}⚙️  Setting up backend...${NC}"
    cd server

    # Install dependencies
    npm install --production

    # Create production .env file
    echo -e "${YELLOW}📝 Creating backend .env file...${NC}"
    cat > .env <<EOT
    NODE_ENV=production
    PORT=5000

    # Database
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=$DB_NAME
    DB_USERNAME=$DB_USER
    DB_PASSWORD=$DB_PASS
    # Alternative: DATABASE_URL format
    DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME

    # Redis
    REDIS_URL=redis://localhost:6379

    # MinIO
    MINIO_ENDPOINT=localhost
    MINIO_PORT=9000
    MINIO_ACCESS_KEY=$MINIO_ROOT_USER
    MINIO_SECRET_KEY=$MINIO_ROOT_PASSWORD
    MINIO_BUCKET_NAME=edumapping-files
    MINIO_USE_SSL=false

    # JWT Secrets
    JWT_SECRET=$JWT_SECRET
    JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET

    # Frontend URL
    FRONTEND_URL=https://$DOMAIN_NAME,https://www.$DOMAIN_NAME

    # API Public URL
    API_PUBLIC_URL=https://$DOMAIN_NAME/api

    # Email Configuration (UPDATE THESE WITH YOUR SMTP CREDENTIALS)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password

    # SSL Settings
    PGSSLMODE=disable
    DATABASE_SSL=false
    EOT

    echo -e "${GREEN}✅ Backend .env file created${NC}"

    # Run database migrations
    echo -e "${YELLOW}🔄 Running database migrations...${NC}"
    npm run db:migrate:prod || echo -e "${YELLOW}⚠️  Migration failed or already run${NC}"

    # --- Setup PM2 ---
    echo -e "${YELLOW}⚙️  Setting up PM2...${NC}"
    sudo npm install -g pm2

    # Start backend with PM2
    pm2 delete edumapping-api 2>/dev/null || true
    pm2 start src/server.js --name edumapping-api --node-args="--max-old-space-size=1024"
    pm2 startup systemd -u $USER --hp /home/$USER
    pm2 save

    echo -e "${GREEN}✅ Backend started with PM2${NC}"

    # Wait for server to start
    sleep 3
    if pm2 list | grep -q "online"; then
        echo -e "${GREEN}✅ Backend is running${NC}"
    else
        echo -e "${RED}❌ Backend failed to start. Check logs: pm2 logs edumapping-api${NC}"
    fi

    # --- Setup Frontend ---
    echo -e "${YELLOW}⚙️  Setting up frontend...${NC}"
    cd ../client

    # Install dependencies
    npm install

    # Create production build with correct API URL
    REACT_APP_API_URL="https://$DOMAIN_NAME/api"
    export REACT_APP_API_URL

    echo -e "${YELLOW}🔨 Building React app...${NC}"
    npm run build

    if [ ! -d "build" ]; then
        echo -e "${RED}❌ Frontend build failed!${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Frontend built successfully${NC}"

    # --- Configure Nginx ---
    echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"

    sudo tee /etc/nginx/sites-available/edumapping > /dev/null <<NGINXCONF
    server {
        listen 80;
        server_name $DOMAIN_NAME www.$DOMAIN_NAME;

        # Increase client body size for file uploads
        client_max_body_size 20M;

        # API proxy to backend
        location /api/ {
            proxy_pass http://localhost:5000/api/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # MinIO proxy (optional - for direct file access)
        location /files/ {
            proxy_pass http://localhost:9000/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
        }

        # Serve React app
        location / {
            root $PROJECT_DIR/client/build;
            index index.html;
            try_files \$uri \$uri/ /index.html;
        }

        # Cache static assets
        location /static/ {
            root $PROJECT_DIR/client/build;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
    NGINXCONF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/edumapping /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default

    # Test Nginx configuration
    sudo nginx -t

    # Restart Nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx

    echo -e "${GREEN}✅ Nginx configured${NC}"

    # --- Install Certbot for SSL ---
    echo -e "${YELLOW}🔒 Installing Certbot for SSL...${NC}"
    sudo apt install -y certbot python3-certbot-nginx

    # --- Save Credentials ---
    CREDS_FILE="$HOME/edumapping-credentials.txt"
    cat > $CREDS_FILE <<EOT
    ===========================================
    EduMapping Deployment Credentials
    ===========================================
    Generated: $(date)

    Database:
    Name: $DB_NAME
    User: $DB_USER
    Password: $DB_PASS

    MinIO:
    Endpoint: http://localhost:9000
    Console: http://$(hostname -I | awk '{print $1}'):9001
    Access Key: $MINIO_ROOT_USER
    Secret Key: $MINIO_ROOT_PASSWORD

    JWT Secrets (in .env file):
    JWT_SECRET: [Check server/.env]
    JWT_REFRESH_SECRET: [Check server/.env]

    Domain: $DOMAIN_NAME

    To enable SSL, run:
    sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME

    To view logs:
    pm2 logs edumapping-api
    sudo journalctl -u nginx -f

    To restart services:
    pm2 restart edumapping-api
    sudo systemctl restart nginx
    ===========================================
    EOT

    echo ""
    echo -e "${GREEN}✅ Deployment Complete!${NC}"
    echo ""
    echo -e "${BLUE}📋 Important Information:${NC}"
    echo "  📝 Credentials saved to: $CREDS_FILE"
    echo "  🔗 Backend API: http://$DOMAIN_NAME/api"
    echo "  🌐 Frontend: http://$DOMAIN_NAME"
    echo "  📊 API Docs: http://$DOMAIN_NAME/api-docs"
    echo ""
    echo -e "${YELLOW}⚠️  Next Steps:${NC}"
    echo "  1. Configure DNS: Point $DOMAIN_NAME to $(hostname -I | awk '{print $1}')"
    echo "  2. Update email SMTP settings in server/.env"
    echo "  3. Run SSL certificate: sudo certbot --nginx -d $DOMAIN_NAME"
    echo "  4. Check application logs: pm2 logs edumapping-api"
    echo ""
    echo -e "${GREEN}🎉 Your EduMapping platform is ready!${NC}"

