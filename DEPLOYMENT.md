# Deployment Guide for Render

## Fixed Issues

The build failure on Render has been fixed by:

1. **TypeScript Configuration**: Updated `tsconfig.json` to allow JavaScript imports and disabled problematic declaration generation
2. **Health Check Endpoint**: Added `/health` endpoint for Render's health checks
3. **Render Configuration**: Created `render.yaml` with proper build and start commands

## Files Changed

- `server/tsconfig.json` - Added `allowJs: true` and disabled declarations
- `server/index.js` - Added `/health` endpoint
- `render.yaml` - Created Render deployment configuration

## Environment Variables

Set these in your Render dashboard:

- `NODE_ENV=production`
- `MONGODB_URI=your-mongodb-connection-string`
- `JWT_SECRET=your-jwt-secret-key`
- `CORS_ORIGIN=https://your-frontend-domain.com`

## Deployment Steps

1. **Push to GitHub**: Commit and push all changes
2. **Create Render Service**: 
   - Go to Render dashboard
   - Connect your GitHub repository
   - Select "Web Service"
   - Use the `render.yaml` configuration
3. **Set Environment Variables**: Add the required environment variables in Render dashboard
4. **Deploy**: Render will automatically build and deploy your application

## Build Process

- Build Command: `cd server && npm ci && npm run build`
- Start Command: `cd server && npm start`
- Health Check: `GET /health`

## Troubleshooting

If the build fails:
1. Check the build logs in Render dashboard
2. Verify all environment variables are set
3. Ensure the MongoDB URI is accessible from Render's IP addresses
4. Check that the Node.js version is compatible (>=16.0.0)

## Local Testing

Before deploying, test locally:
```bash
cd server
npm run build
NODE_ENV=production npm start
```

Then visit `http://localhost:9999/health` to verify the health check endpoint works.
