# 🚀 Netlify Deployment Guide

## Quick Deploy Options

### Option 1: Drag & Drop (Easiest)

1. **Build your app:**

   ```bash
   npm run build
   ```

2. **Go to [netlify.com](https://netlify.com)**
3. **Drag the `build` folder** to the deploy area
4. **Your app is live!** 🎉

### Option 2: Git Integration (Recommended)

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Deploy!

### Option 3: Netlify CLI

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**

   ```bash
   netlify login
   ```

3. **Deploy:**

   ```bash
   npm run deploy:netlify
   ```

## 🔧 Environment Variables Setup

### 1. In Netlify Dashboard

1. Go to **Site settings** → **Environment variables**
2. Add your Google AI API key:
   - **Key:** `REACT_APP_GOOGLE_AI_API_KEY`
   - **Value:** `AIza...your_api_key_here`

### 2. Or via Netlify CLI

```bash
netlify env:set REACT_APP_GOOGLE_AI_API_KEY "AIza...your_api_key_here"
```

## 📱 Features That Work on Netlify

✅ **Progressive Web App** - Installable on mobile  
✅ **Camera Access** - Works on HTTPS (Netlify provides this)  
✅ **Voice Commands** - Speech recognition works  
✅ **Google AI Studio** - API calls work perfectly  
✅ **Responsive Design** - Looks great on all devices  
✅ **Service Worker** - Offline capabilities  

## 🎯 Build Configuration

The `netlify.toml` file is already configured with:

- **Build command:** `npm run build`
- **Publish directory:** `build`
- **Node version:** 18
- **Redirects:** SPA routing support
- **Optimization:** CSS/JS minification

## 🚀 Deployment Steps

### Step 1: Prepare Your App

```bash
# Make sure everything is working locally
npm start

# Test the build
npm run build
npm run preview
```

### Step 2: Set Up Environment Variables

```bash
# Create .env file (for local testing)
cp env.example .env
# Edit .env with your API key
```

### Step 3: Deploy to Netlify

```bash
# Option A: Build and drag to Netlify
npm run build

# Option B: Use Netlify CLI
npm run deploy:netlify
```

### Step 4: Configure Environment Variables

1. Go to your Netlify site dashboard
2. **Site settings** → **Environment variables**
3. Add: `REACT_APP_GOOGLE_AI_API_KEY` = `your_api_key`

### Step 5: Test Your Live App

- Test camera functionality
- Try voice commands
- Upload ingredient photos
- Test the AI analysis

## 🔍 Troubleshooting

### Common Issues

1. **Camera not working:**
   - Ensure you're using HTTPS (Netlify provides this)
   - Check browser permissions

2. **API calls failing:**
   - Verify environment variables are set
   - Check API key is correct

3. **Build failures:**
   - Check for TypeScript errors
   - Ensure all dependencies are installed

4. **Routing issues:**
   - The `_redirects` file handles SPA routing
   - All routes redirect to `index.html`

## 🎉 Success

Your AI Cooking Coach will be live at:
`https://your-app-name.netlify.app`

## 🏆 Hackathon Ready

Your deployed app now has:

- ✅ **Live URL** for judges to test
- ✅ **Google AI Studio** integration
- ✅ **Multimodal capabilities**
- ✅ **Professional UI**
- ✅ **Mobile optimization**

**Share your Netlify URL and start winning that hackathon! 🏆**
