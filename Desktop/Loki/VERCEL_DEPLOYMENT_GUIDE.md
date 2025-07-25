# LOKI 2032 Vercel Full-Stack Deployment Guide

## Prerequisites
```bash
npm install -g vercel
vercel login
```

## 1. Project Structure (Already Set Up)
- ✅ Frontend moved to Next.js with API routes
- ✅ Backend dependencies added to frontend/package.json
- ✅ API routes converted to Next.js serverless functions
- ✅ Vercel configuration updated for full-stack deployment

## 2. Environment Variables Setup

### In Vercel Dashboard:
```bash
# Add these environment variables in Vercel dashboard
DATABASE_URL=your-vercel-postgres-url
REDIS_URL=your-vercel-redis-url
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=production
```

### Using Vercel CLI:
```bash
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add JWT_SECRET
vercel env add JWT_REFRESH_SECRET
vercel env add WATSON_API_KEY
```

## 3. Database Setup

### Create Vercel Postgres:
```bash
vercel storage create postgres prediction-market-db
```

### Create Vercel Redis:
```bash
vercel storage create redis prediction-market-redis
```

## 4. Deploy Application
```bash
# From project root
vercel --prod
```

## 5. Post-Deployment

### Run Migrations:
```bash
vercel env pull .env.local
cd frontend && npm run migrate
```

### Test Endpoints:
- Health Check: `https://your-app.vercel.app/api/health`
- API v1 Health: `https://your-app.vercel.app/api/v1/health`

## 6. Environment Variables Reference

Copy `.env.example` and update with your values:
- `DATABASE_URL`: Vercel Postgres connection string
- `REDIS_URL`: Vercel Redis connection string
- `JWT_SECRET`: Strong random secret for JWT tokens
- `WATSON_API_KEY`: IBM Watson API key
- `FRONTEND_URL`: Your Vercel app URL

## 7. Troubleshooting

### API Routes Not Working:
- Check `frontend/pages/api/` directory structure
- Verify environment variables are set in Vercel dashboard
- Check function logs in Vercel dashboard

### Database Connection Issues:
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
- Check Vercel Postgres connection limits
- Run migrations after deployment

### Build Failures:
- Check `frontend/package.json` for all required dependencies
- Verify TypeScript configuration
- Check build logs in Vercel dashboard