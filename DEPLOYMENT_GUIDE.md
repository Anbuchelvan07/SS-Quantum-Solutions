# Deployment Guide: Vercel + Render

## Step 1: Prepare Backend for Render Deployment

### 1.1 Check Node.js Configuration
```bash
# Verify your package.json has correct scripts
# Should have: "server": "node server/index.js"
```

### 1.2 Create `.env.production` in root
```env
# MongoDB (use your existing MongoDB Atlas URI)
MONGO_URI=your_mongodb_atlas_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Admin Bootstrap
ADMIN_EMAIL=anbuchelvanoffl2006@gmail.com
ADMIN_PASSWORD=AdminPassword123456!
ADMIN_NAME=Administrator

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Port (Render will set this automatically)
PORT=5001
```

### 1.3 Update server/index.js to handle production PORT
The code already uses: `const PORT = process.env.PORT || 5001` ✅

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
- Go to https://render.com
- Sign up with GitHub account (easier for deployments)

### 2.2 Deploy New Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Fill in details:
   - **Name:** hr-consultancy-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`
4. Add Environment Variables (copy from .env.production):
   - MONGO_URI
   - JWT_SECRET
   - ADMIN_EMAIL
   - ADMIN_PASSWORD
   - ADMIN_NAME
   - RESEND_API_KEY

### 2.3 Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Copy the URL: `https://hr-consultancy-api.onrender.com` (example)

---

## Step 3: Prepare Frontend for Vercel Deployment

### 3.1 Update vite.config.js (if needed)
Already configured for production build ✅

### 3.2 Create `.env.production` in root for frontend
```env
# This will be loaded by Vite during build
VITE_API_URL=https://your-render-backend-url.com
```

Example:
```env
VITE_API_URL=https://hr-consultancy-api.onrender.com
```

### 3.3 Update src/services/api.js
The apiRequest function already uses `/api/` path which works with both local and production servers.

**Important:** Make sure the API calls use the correct base URL:

Update the `apiRequest` function to handle production URLs:

```javascript
async function apiRequest(path, options = {}) {
  // Use VITE_API_URL if available, otherwise use relative path
  const baseUrl = import.meta.env.VITE_API_URL || ''
  const url = baseUrl ? `${baseUrl}${path}` : path
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  // ... rest of the function
}
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub account

### 4.2 Import and Deploy Project
1. Click "Add New..." → "Project"
2. Select your GitHub repository
3. Fill in details:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://hr-consultancy-api.onrender.com` (your Render URL)

### 4.3 Deploy
- Click "Deploy"
- Wait for build to complete
- Get your live URL: `https://your-project.vercel.app`

---

## Step 5: Configure CORS for Production

### 5.1 Update server/index.js
Make sure CORS allows your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-vercel-domain.vercel.app'
  ],
  credentials: true
}))
```

---

## Step 6: Update MongoDB and Email Whitelist

### 6.1 MongoDB Atlas IP Whitelist
1. Go to https://cloud.mongodb.com
2. Project → Network Access
3. Add IP Address: Allow from Anywhere (0.0.0.0/0)
   - ⚠️ Or add Render's IP address when available

### 6.2 Resend Email Configuration
- Already configured in backend ✅
- Verify RESEND_API_KEY is set in Render environment variables

---

## Step 7: Test Production Deployment

### 7.1 Test Backend
```bash
# Visit: https://hr-consultancy-api.onrender.com/api/health
# Should return: { "success": true, "message": "API is running." }
```

### 7.2 Test Frontend
```bash
# Visit your Vercel URL
# Check DevTools Console for any API errors
# Test login/booking flows
```

### 7.3 Check API Communication
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform a login or booking
4. Verify requests go to your Render backend URL

---

## Troubleshooting

### Issue: CORS Errors
**Solution:** Add your Vercel domain to CORS whitelist in server/index.js

### Issue: 404 on API calls
**Solution:** Verify VITE_API_URL environment variable is set in Vercel

### Issue: MongoDB connection fails
**Solution:** 
- Check MONGO_URI is correct
- Verify MongoDB IP whitelist allows Render

### Issue: Render goes to sleep
**Solution:** Subscribe to Render's paid plan to prevent idle timeout
- Free tier: Spins down after 15 mins of inactivity
- Paid tier: Always running

---

## Deployment Checklist

- [ ] Backend `.env.production` created with all variables
- [ ] Render account created
- [ ] Backend deployed to Render (note the URL)
- [ ] Frontend `.env.production` updated with VITE_API_URL
- [ ] `src/services/api.js` updated to use VITE_API_URL
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] CORS updated in `server/index.js`
- [ ] MongoDB IP whitelist updated
- [ ] Testing: /api/health endpoint works
- [ ] Testing: Login flow works
- [ ] Testing: Booking flow works
- [ ] Testing: Admin dashboard works

---

## Production URLs (Examples)

After deployment, your URLs will be:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://hr-consultancy-api.onrender.com`
- **API Health Check:** `https://hr-consultancy-api.onrender.com/api/health`

---

## Important Notes

1. **Cold Starts:** Render free tier may have 30-50 second cold starts
2. **Environment Variables:** Must be set in both Render and Vercel dashboards
3. **Database:** Needs MongoDB Atlas (cloud database) - already using it ✅
4. **Email:** Resend is cloud-based - already configured ✅
5. **HTTPS:** Both Vercel and Render provide free SSL certificates ✅

---

## Next Steps After Deployment

1. Monitor Render logs for errors
2. Monitor Vercel analytics
3. Set up error tracking (optional: Sentry)
4. Configure custom domain (optional)
5. Set up GitHub Actions for auto-deploy (optional)
