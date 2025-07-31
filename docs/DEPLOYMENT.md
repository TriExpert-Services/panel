# Guía de Deployment 🚀

Guía completa para desplegar el Translation Administration System en diferentes entornos.

## Tabla de Contenidos

- [Estrategias de Deployment](#estrategias-de-deployment)
- [Deployment Local](#deployment-local)
- [Deployment con Docker](#deployment-con-docker)
- [Deployment en Producción](#deployment-en-producción)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoreo y Logging](#monitoreo-y-logging)
- [Troubleshooting](#troubleshooting)

## Estrategias de Deployment

### Entornos Disponibles

| Entorno | Propósito | URL Ejemplo | Configuración |
|---------|-----------|-------------|---------------|
| **Development** | Desarrollo local | `http://localhost:6300` | `.env.development` |
| **Staging** | Testing pre-producción | `https://staging.translation-admin.com` | `.env.staging` |
| **Production** | Producción live | `https://translation-admin.com` | `.env.production` |

### Métodos de Deployment

| Método | Complejidad | Escalabilidad | Recomendado para |
|--------|-------------|---------------|------------------|
| **Manual** | Bajo | Bajo | Desarrollo local |
| **Docker** | Medio | Alto | Producción pequeña-mediana |
| **Kubernetes** | Alto | Muy Alto | Producción empresarial |
| **Cloud Platforms** | Medio | Alto | Startups/empresas |

## Deployment Local

### 1. Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con configuración local

# Ejecutar en modo desarrollo
npm run dev
```

**Variables de entorno locales:**
```env
# .env.development
VITE_SUPABASE_URL=https://localhost.supabase.co
VITE_SUPABASE_ANON_KEY=your_local_key
NODE_ENV=development
VITE_API_TIMEOUT=10000
```

### 2. Build Local para Testing

```bash
# Construir para producción
npm run build

# Previsualizar build
npm run preview

# Verificar en http://localhost:4173
```

### 3. Servidor Local con Node.js

```bash
# Instalar servidor estático
npm install -g serve

# Servir archivos construidos
serve -s dist -l 6300

# Acceder en http://localhost:6300
```

## Deployment con Docker

### 1. Docker Simple

#### Dockerfile Optimizado

```dockerfile
# Multi-stage build para optimizar tamaño
FROM node:18-alpine as builder

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (solo producción)
RUN npm ci --only=production --silent

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Cambiar permisos
RUN chown -R nextjs:nodejs /usr/share/nginx/html
RUN chown -R nextjs:nodejs /var/cache/nginx

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
```

#### Construir y Ejecutar

```bash
# Construir imagen
docker build -t translation-admin:latest .

# Ejecutar contenedor
docker run -d \
  --name translation-admin \
  -p 6300:80 \
  --env-file .env.production \
  --restart unless-stopped \
  translation-admin:latest

# Verificar
docker ps
docker logs translation-admin
```

### 2. Docker Compose

#### docker-compose.yml Completo

```yaml
version: '3.8'

services:
  # Aplicación principal
  translation-admin:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    container_name: translation-admin
    ports:
      - "6300:80"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    volumes:
      - ./logs:/var/log/nginx
    networks:
      - translation-network
    restart: unless-stopped
    depends_on:
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Redis para cache (opcional)
  redis:
    image: redis:7-alpine
    container_name: translation-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - translation-network
    restart: unless-stopped
    command: redis-server --save 20 1 --loglevel warning

  # Nginx Proxy (opcional)
  nginx-proxy:
    image: nginx:alpine
    container_name: translation-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/proxy.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    networks:
      - translation-network
    restart: unless-stopped
    depends_on:
      - translation-admin

  # Watchtower para auto-updates (opcional)
  watchtower:
    image: containrrr/watchtower
    container_name: translation-watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=3600
    restart: unless-stopped

volumes:
  redis_data:
    driver: local

networks:
  translation-network:
    driver: bridge
```

#### Comandos Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Escalar servicios
docker-compose up -d --scale translation-admin=3

# Parar servicios
docker-compose down

# Parar y limpiar
docker-compose down -v --remove-orphans
```

### 3. Docker con SSL/HTTPS

#### Configuración Let's Encrypt

```bash
# Crear directorio SSL
mkdir -p ssl

# Obtener certificados SSL
docker run -it --rm \
  -v $(pwd)/ssl:/etc/letsencrypt \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  -d tu-dominio.com \
  --email tu-email@example.com \
  --agree-tos
```

#### nginx.conf con SSL

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    
    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name tu-dominio.com;
        return 301 https://$server_name$request_uri;
    }
    
    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name tu-dominio.com;
        
        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/live/tu-dominio.com/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/live/tu-dominio.com/privkey.pem;
        
        ssl_session_timeout 1d;
        ssl_session_cache shared:MozTLS:10m;
        ssl_session_tickets off;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers off;
        
        # HSTS
        add_header Strict-Transport-Security "max-age=63072000" always;
        
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

## Deployment en Producción

### 1. VPS/Servidor Dedicado

#### Preparación del Servidor

```bash
# Actualizar sistema (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configurar firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Crear usuario para la aplicación
sudo useradd -m -s /bin/bash translation-admin
sudo usermod -aG docker translation-admin
```

#### Deployment Script

```bash
#!/bin/bash
# deploy-production.sh

set -e

echo "🚀 Starting production deployment..."

# Variables
APP_DIR="/opt/translation-admin"
BACKUP_DIR="/opt/backups"
LOG_FILE="/var/log/translation-admin-deploy.log"

# Crear directorios
sudo mkdir -p $APP_DIR $BACKUP_DIR
sudo chown -R translation-admin:translation-admin $APP_DIR

# Cambiar al directorio de la aplicación
cd $APP_DIR

# Backup actual si existe
if [ -d "current" ]; then
    echo "📦 Creating backup..."
    sudo cp -r current $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)
fi

# Descargar nueva versión
echo "📥 Downloading latest version..."
git clone https://github.com/your-org/translation-admin.git new-release
cd new-release

# Configurar variables de entorno
echo "⚙️ Setting up environment..."
cp .env.production .env

# Construir aplicación
echo "🔨 Building application..."
docker-compose build

# Parar servicios actuales
echo "⏹️ Stopping current services..."
cd $APP_DIR
if [ -d "current" ]; then
    cd current
    docker-compose down
    cd ..
fi

# Mover nueva versión
echo "🔄 Deploying new version..."
rm -rf current
mv new-release current
cd current

# Iniciar nuevos servicios
echo "▶️ Starting new services..."
docker-compose up -d

# Verificar deployment
echo "🔍 Verifying deployment..."
sleep 30
curl -f http://localhost:6300/health || {
    echo "❌ Health check failed, rolling back..."
    docker-compose down
    cd ..
    rm -rf current
    cp -r $BACKUP_DIR/backup-$(ls -t $BACKUP_DIR | head -1) current
    cd current
    docker-compose up -d
    exit 1
}

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at http://your-domain.com"

# Limpiar backups antiguos (mantener últimos 5)
echo "🧹 Cleaning old backups..."
cd $BACKUP_DIR
ls -t | tail -n +6 | xargs -r rm -rf

echo "🎉 Deployment finished!"
```

### 2. Cloud Platforms

#### AWS EC2

```bash
# Instalar AWS CLI
pip install awscli

# Configurar credentials
aws configure

# Crear instancia EC2
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1d0 \
    --count 1 \
    --instance-type t3.medium \
    --key-name your-key-pair \
    --security-group-ids sg-xxxxxxxx \
    --user-data file://user-data.sh
```

**user-data.sh:**
```bash
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker

# Instalar docker-compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clonar y ejecutar aplicación
cd /opt
git clone https://github.com/your-org/translation-admin.git
cd translation-admin
cp .env.production .env
docker-compose up -d
```

#### DigitalOcean Droplet

```bash
# Crear droplet usando doctl
doctl compute droplet create translation-admin \
    --image ubuntu-20-04-x64 \
    --size s-2vcpu-4gb \
    --region nyc1 \
    --ssh-keys your-ssh-key-id \
    --user-data-file user-data.sh
```

#### Google Cloud Platform

```yaml
# app.yaml para App Engine
runtime: nodejs18

env_variables:
  NODE_ENV: production
  VITE_SUPABASE_URL: your-supabase-url
  VITE_SUPABASE_ANON_KEY: your-supabase-key

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6

resources:
  cpu: 1
  memory_gb: 2
  disk_size_gb: 10
```

```bash
# Deploy a App Engine
gcloud app deploy
```

### 3. Kubernetes (K8s)

#### Deployment YAML

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: translation-admin

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: translation-admin-config
  namespace: translation-admin
data:
  NODE_ENV: "production"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: translation-admin-secrets
  namespace: translation-admin
type: Opaque
stringData:
  VITE_SUPABASE_URL: "https://your-project.supabase.co"
  VITE_SUPABASE_ANON_KEY: "your-anon-key"

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: translation-admin
  namespace: translation-admin
spec:
  replicas: 3
  selector:
    matchLabels:
      app: translation-admin
  template:
    metadata:
      labels:
        app: translation-admin
    spec:
      containers:
      - name: translation-admin
        image: translation-admin:latest
        ports:
        - containerPort: 80
        envFrom:
        - configMapRef:
            name: translation-admin-config
        - secretRef:
            name: translation-admin-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: translation-admin-service
  namespace: translation-admin
spec:
  selector:
    app: translation-admin
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: translation-admin-ingress
  namespace: translation-admin
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - translation-admin.com
    secretName: translation-admin-tls
  rules:
  - host: translation-admin.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: translation-admin-service
            port:
              number: 80
```

```bash
# Aplicar configuración
kubectl apply -f k8s/

# Verificar deployment
kubectl get pods -n translation-admin
kubectl get services -n translation-admin
kubectl get ingress -n translation-admin
```

## CI/CD Pipeline

### 1. GitHub Actions

#### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Build application
      run: npm run build

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/translation-admin
          docker-compose pull
          docker-compose up -d
          docker system prune -f
```

### 2. GitLab CI/CD

#### .gitlab-ci.yml

```yaml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

before_script:
  - docker info

test:
  stage: test
  image: node:18-alpine
  script:
    - npm ci
    - npm run test
    - npm run lint
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main

deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "
        cd /opt/translation-admin &&
        docker-compose pull &&
        docker-compose up -d &&
        docker system prune -f"
  only:
    - main
  when: manual
```

### 3. Jenkins Pipeline

#### Jenkinsfile

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        IMAGE_NAME = 'translation-admin'
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-org/translation-admin.git'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm run test'
                sh 'npm run lint'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results.xml'
                    publishCoverageGlobalResults parsers: [cobertura('coverage/cobertura-coverage.xml')]
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}")
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                sh """
                    kubectl set image deployment/translation-admin translation-admin=${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER} -n staging
                    kubectl rollout status deployment/translation-admin -n staging
                """
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh """
                    kubectl set image deployment/translation-admin translation-admin=${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER} -n production
                    kubectl rollout status deployment/translation-admin -n production
                """
            }
        }
    }
    
    post {
        success {
            slackSend channel: '#deployments', 
                     color: 'good', 
                     message: "✅ Translation Admin deployed successfully - Build ${env.BUILD_NUMBER}"
        }
        failure {
            slackSend channel: '#deployments', 
                     color: 'danger', 
                     message: "❌ Translation Admin deployment failed - Build ${env.BUILD_NUMBER}"
        }
    }
}
```

## Monitoreo y Logging

### 1. Health Checks

#### Endpoint de Health Check

```typescript
// src/health.ts
export async function healthCheck() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.VITE_APP_VERSION || '1.0.0',
    services: {
      database: await checkDatabase(),
      storage: await checkStorage(),
      smtp: await checkSMTP()
    }
  };
  
  const allHealthy = Object.values(checks.services).every(status => status === 'healthy');
  checks.status = allHealthy ? 'healthy' : 'unhealthy';
  
  return checks;
}
```

#### Docker Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1
```

### 2. Logging

#### Configuración de Logs

```yaml
# docker-compose.yml
version: '3.8'
services:
  translation-admin:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

#### ELK Stack (Elasticsearch, Logstash, Kibana)

```yaml
# docker-compose.logging.yml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    volumes:
      - ./logstash/config:/usr/share/logstash/pipeline
    networks:
      - elk
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    networks:
      - elk
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:

networks:
  elk:
```

### 3. Monitoring con Prometheus

#### prometheus.yml

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'translation-admin'
    static_configs:
      - targets: ['translation-admin:80']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

#### Docker Compose con Monitoring

```yaml
version: '3.8'
services:
  translation-admin:
    # ... configuración anterior

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus:/etc/prometheus
    networks:
      - monitoring

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter
    ports:
      - "9100:9100"
    networks:
      - monitoring

volumes:
  grafana_data:

networks:
  monitoring:
```

## Troubleshooting

### Problemas Comunes de Deployment

#### 1. Errores de Build

```bash
# Error: out of memory durante build
Error: JavaScript heap out of memory

# Solución: Aumentar memoria para Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### 2. Errores de Docker

```bash
# Error: puerto en uso
Error: Port 6300 already in use

# Solución: Encontrar y matar proceso
lsof -i :6300
kill -9 <PID>

# O cambiar puerto en docker-compose.yml
ports:
  - "6301:80"
```

#### 3. Errores de Conexión a Base de Datos

```bash
# Error: Connection refused
Error: connect ECONNREFUSED

# Verificar variables de entorno
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verificar conectividad
curl -I $VITE_SUPABASE_URL
```

### Scripts de Debugging

#### debug-deployment.sh

```bash
#!/bin/bash
# debug-deployment.sh

echo "🔍 Translation Admin Deployment Debug"
echo "===================================="

echo "📋 System Information:"
echo "OS: $(uname -a)"
echo "Docker: $(docker --version)"
echo "Docker Compose: $(docker-compose --version)"
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "npm: $(npm --version 2>/dev/null || echo 'Not installed')"

echo ""
echo "🐳 Docker Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📊 Container Resources:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "📝 Recent Logs:"
docker-compose logs --tail=50 translation-admin

echo ""
echo "🌐 Network Connectivity:"
curl -I http://localhost:6300 || echo "❌ Application not responding"

echo ""
echo "💾 Disk Usage:"
df -h

echo ""
echo "🔧 Environment Variables:"
docker exec translation-admin env | grep VITE_ || echo "❌ Cannot access container environment"
```

### Rollback Procedures

#### Rollback Automático

```bash
#!/bin/bash
# rollback.sh

set -e

BACKUP_DIR="/opt/backups"
APP_DIR="/opt/translation-admin"

echo "🔄 Starting rollback procedure..."

# Parar servicios actuales
cd $APP_DIR/current
docker-compose down

# Encontrar último backup
LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -1)
echo "📦 Rolling back to: $LATEST_BACKUP"

# Restaurar backup
cd $APP_DIR
rm -rf current
cp -r $BACKUP_DIR/$LATEST_BACKUP current

# Iniciar servicios
cd current
docker-compose up -d

# Verificar
sleep 30
curl -f http://localhost:6300/health || {
    echo "❌ Rollback failed"
    exit 1
}

echo "✅ Rollback completed successfully"
```

### Monitoring de Deployment

#### deployment-monitor.sh

```bash
#!/bin/bash
# deployment-monitor.sh

while true; do
    echo "$(date): Checking application health..."
    
    # Health check
    if curl -f http://localhost:6300/health >/dev/null 2>&1; then
        echo "✅ Application healthy"
    else
        echo "❌ Application unhealthy"
        # Enviar alerta
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚨 Translation Admin is down!"}' \
            $SLACK_WEBHOOK_URL
    fi
    
    # Resource monitoring
    MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemPerc}}" translation-admin | tr -d '%')
    if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
        echo "⚠️ High memory usage: ${MEMORY_USAGE}%"
    fi
    
    sleep 60
done
```

¡Con esta guía completa de deployment tienes todo lo necesario para poner tu Translation Administration System en producción de manera segura y escalable! 🚀