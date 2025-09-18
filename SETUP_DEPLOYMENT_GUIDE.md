# 🚀 MindScope Complete Setup & Deployment Guide

## 📋 **Quick Start Overview**
MindScope is a Next.js 15 TypeScript application with multilingual AI therapy capabilities. This guide covers complete setup from development to production deployment.

---

## 🛠️ **Local Development Setup**

### **Prerequisites**
```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
Code editor (VS Code recommended)
```

### **1. Clone & Install**
```bash
git clone https://github.com/Soumodip04/MindScope.git
cd MindScope
npm install
```

### **2. Environment Configuration**
Create `.env.local` file in root directory:
```env
# Groq AI API (Required for AI responses)
GROQ_API_KEY=your_groq_api_key_here

# Database (Optional - uses fallback if not provided)
DATABASE_URL="postgresql://username:password@localhost:5432/mindscope"

# NextAuth (Optional - for user authentication)
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000

# Disable telemetry
NEXT_TELEMETRY_DISABLED=1
```

### **3. Get Groq API Key**
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for free account
3. Navigate to API Keys section
4. Create new API key
5. Copy key to `.env.local`

### **4. Start Development Server**
```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 🏭 **Production Deployment**

### **Method 1: Vercel Deployment (Recommended)**

#### **Automatic Deployment**
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy MindScope"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

#### **Manual Vercel Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### **Environment Variables for Vercel**
In Vercel dashboard, add these environment variables:
```
GROQ_API_KEY = your_groq_api_key_here
NEXT_TELEMETRY_DISABLED = 1
NEXTAUTH_SECRET = your_random_secret_key
NEXTAUTH_URL = https://your-domain.vercel.app
```

### **Method 2: Manual Production Build**

#### **Build Process**
```bash
# Clean previous builds
rm -rf .next
rm -rf node_modules/.cache

# Set production environment
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Install dependencies
npm ci

# Build application
npm run build

# Start production server
npm start
```

#### **Build Verification**
✅ **Successful Build Indicators**:
- "✅ Real AI responses enabled with Groq API!"
- "✓ Compiled successfully"
- "✓ Generating static pages"
- No TypeScript errors

### **Method 3: Docker Deployment**

#### **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### **Build & Run Container**
```bash
# Build Docker image
docker build -t mindscope .

# Run container
docker run -p 3000:3000 --env-file .env.local mindscope
```

---

## 🌍 **Platform Configuration**

### **Multilingual Setup**
The platform supports 20+ languages out of the box:
- **Indian Languages**: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi, Malayalam, Kannada
- **International**: English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Portuguese, Russian

**Configuration**: Language settings are in `src/lib/languageConfig.ts`

### **Crisis Response Configuration**
Emergency numbers are automatically configured per region:
- **India**: 9152987821 (Suicide Prevention), 112 (Emergency)
- **US**: 988 (Crisis Lifeline), 911 (Emergency)
- **UK**: 116 123 (Samaritans), 999 (Emergency)

**Configuration**: Emergency contacts in `src/lib/languageConfig.ts`

### **AI Model Configuration**
Current AI settings:
```typescript
model: "llama3-8b-8192"
maxTokens: 1000 (therapeutic) / 300 (casual)
temperature: 0.7 (therapeutic) / 0.3 (casual)
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Build Errors**
```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm install
npm run build
```

#### **Groq API Issues**
- Verify API key in `.env.local`
- Check Groq console for rate limits
- Ensure key is not expired

#### **TypeScript Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix type issues
npm run lint
npm run type-check
```

#### **Deployment Failures**
- Check environment variables are set
- Verify Node.js version compatibility
- Ensure all dependencies are installed

### **Debugging Tips**
```bash
# Check environment variables
npm run env-check

# Verbose build output
npm run build -- --debug

# Check application logs
npm run logs
```

---

## 📊 **Performance Optimization**

### **Production Optimizations**
- ✅ Static page generation for 40+ routes
- ✅ Code splitting and lazy loading
- ✅ Image optimization with Next.js
- ✅ Minified CSS and JavaScript
- ✅ Gzip compression enabled

### **Monitoring Setup**
```javascript
// Add to next.config.js
module.exports = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' }
      ]
    }
  ]
}
```

---

## 🛡️ **Security Configuration**

### **Environment Security**
- Never commit `.env.local` to version control
- Use different API keys for development/production
- Rotate API keys regularly
- Enable 2FA on all service accounts

### **Application Security**
- HTTPS enforced in production
- Content Security Policy headers
- XSS protection enabled
- CSRF protection implemented

---

## 🎯 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Environment variables configured
- [ ] Groq API key valid and tested
- [ ] Build completes without errors
- [ ] All features tested locally
- [ ] Crisis response system verified

### **Post-Deployment**
- [ ] Application loads correctly
- [ ] AI responses working
- [ ] Multilingual support functional
- [ ] Crisis detection active
- [ ] Analytics tracking enabled

### **Production Verification**
- [ ] Test casual conversation mode
- [ ] Test therapeutic response mode
- [ ] Verify crisis intervention
- [ ] Check multiple languages
- [ ] Confirm emergency numbers display

---

## 🚀 **Launch Commands**

### **Development**
```bash
npm run dev
```

### **Production Build**
```bash
npm run build && npm start
```

### **Vercel Deployment**
```bash
vercel --prod
```

### **Quick Deployment Script**
```bash
#!/bin/bash
git add .
git commit -m "Deploy MindScope v$(date +%Y%m%d)"
git push origin main
vercel --prod
echo "🚀 MindScope deployed successfully!"
```

---

**🎉 Ready for global deployment as a multilingual mental health platform!**

**Support**: For deployment issues, check the troubleshooting section or review build logs for specific error messages.