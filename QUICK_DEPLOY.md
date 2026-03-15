# Quick Deployment Steps - Vercel + Render

## 📋 Pre-Deployment Checklist

- [ ] GitHub account with your project repository
- [ ] Vercel account (https://vercel.com)
- [ ] Render account (https://render.com)
- [ ] All environment variables ready

---

## 🚀 Step 1: Deploy Backend to Render (5 minutes)

### 1. Go to Render.com → New Web Service

### 2. Connect GitHub
- Click "Connect account" with GitHub
- Authorize Render
- Select your `hr-consultancy-app` repository

### 3. Configure Service
```
Name: hr-consultancy-api
Region: Oregon (or your closest)
Branch: main
Runtime: Node
Build Command: npm install
Start Command: npm run server
```

### 4. Add Environment Variables
Copy and paste these (get values from your .env file):

```
MONGO_URI = [your MongoDB Atlas connection string]
JWT_SECRET = [your jwt secret]
ADMIN_EMAIL = anbuchelvanoffl2006@gmail.com
ADMIN_PASSWORD = AdminPassword123456!
ADMIN_NAME = Administrator
RESEND_API_KEY = [your Resend API key]
NODE_ENV = production
```

### 5. Create Web Service
- Click "Create Web Service"
- Wait for deployment (might take 2-3 minutes)
- Copy your backend URL: `https://hr-consultancy-api.onrender.com`

### 6. Test Health Check
Visit in browser: `https://hr-consultancy-api.onrender.com/api/health`

Should show: `{ "success": true, "message": "API is running." }`

---

## 🎨 Step 2: Deploy Frontend to Vercel (5 minutes)

### 1. Go to Vercel.com → Add New Project

### 2. Import Project from GitHub
- Click "Continue with GitHub"
- Find and select `hr-consultancy-app`
- Click "Import"

### 3. Configure Project
```
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4. Add Environment Variable
```
Name: VITE_API_URL
Value: https://hr-consultancy-api.onrender.com
```
(Use your actual Render backend URL from Step 1)

### 5. Deploy
- Click "Deploy"
- Wait for build to complete (1-2 minutes)
- Get your frontend URL: `https://your-project.vercel.app`

---

## 🔗 Step 3: Link Frontend and Backend

### Update Render CORS
1. Go back to Render → hr-consultancy-api service
2. Environment → Add Variable:
   ```
   FRONTEND_URL = https://your-vercel-domain.vercel.app
   ```
3. Save and the service will auto-redeploy

---

## ✅ Testing Your Deployment

### Test 1: Backend Health
```
Visit: https://hr-consultancy-api.onrender.com/api/health
Expected: { "success": true, "message": "API is running." }
```

### Test 2: Frontend Loads
```
Visit: https://your-project.vercel.app
Expected: Your website loads normally
```

### Test 3: Customer Login
```
1. Click "Login" button in navbar
2. Register with new account OR use test account
3. Should redirect to booking page
```

### Test 4: Create Booking
```
1. Go to booking page
2. Select date, time, consultation type (Online/Offline)
3. Submit
4. Check browser console (F12) for API calls
5. Should succeed
```

### Test 5: Admin Dashboard
```
1. Login as admin OR enter access code
2. Should see bookings from step 4
3. Click "Accept" to confirm
4. Click "Meeting" to set up online meeting (if online)
5. Should work without errors
```

---

## 🐛 Troubleshooting

### Issue: "Cannot reach backend" or CORS error
**Solution:** 
1. Verify VITE_API_URL is set in Vercel
2. Verify FRONTEND_URL is set in Render
3. Redeploy both services

### Issue: Login returns 401
**Solution:**
1. Check MONGO_URI is correct in Render
2. Check JWT_SECRET matches both local and production
3. Try creating new user if old one doesn't exist in production DB

### Issue: Booking fails to save
**Solution:**
1. Check network tab (F12) - does API call reach backend?
2. Check Render logs for errors
3. Verify MongoDB IP whitelist includes 0.0.0.0/0 or Render IP

### Issue: Render service keeps spinning down
**Solution:**
- Free Heroku tier spins down after 15 mins
- Upgrade to Render's paid plan ($7/month) to keep it always running
- Or use a cron job to keep it alive (not recommended)

### Issue: Emails not sending
**Solution:**
1. Verify RESEND_API_KEY is set
2. Check Render logs for email errors
3. Verify recipient email address is real

### Issue: Dark mode not working
**Solution:**
- This is likely a caching issue on Vercel
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache

---

## 📊 Monitoring & Logs

### View Render Backend Logs
1. Render Dashboard → hr-consultancy-api
2. Logs tab at bottom
3. Look for `[BOOKING CREATE]` or error messages

### View Vercel Deployment Logs
1. Vercel Dashboard → your project
2. Deployments tab
3. Click on a deployment → Logs

---

## 🔐 Security Checklist

- [ ] Never commit .env file to GitHub
- [ ] .gitignore includes `.env*` ✅
- [ ] Environment variables set in Render dashboard
- [ ] Environment variables set in Vercel dashboard
- [ ] MongoDB IP whitelist allows Render (0.0.0.0/0)
- [ ] JWT_SECRET is strong and different for production
- [ ] FRONTEND_URL matches actual Vercel domain

---

## 💾 Database Notes

Your project uses **MongoDB Atlas** (cloud MongoDB):
- Already working locally ✅
- Will work in production ✅
- Just need IP whitelist to allow Render

---

## 📱 Testing from Mobile

After deployment, test from a phone:
1. Go to your Vercel URL
2. Try login
3. Try booking
4. Check responsive design works

---

## 🎯 Production URLs

After deployment:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://hr-consultancy-api.onrender.com`
- **API Health:** `https://hr-consultancy-api.onrender.com/api/health`

---

## ❓ Need Help?

- Check DEPLOYMENT_GUIDE.md for detailed instructions
- Check Render logs for backend issues
- Check Vercel deployment logs for frontend issues
- Verify all environment variables are set
- Test with curl or Postman to verify API endpoints

---

**Happy Deploying! 🚀**
