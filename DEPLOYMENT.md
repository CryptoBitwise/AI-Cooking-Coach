# 🚀 Deployment Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

### 3. Build for Production

```bash
npm run build
```

## 🌐 Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Deploy with one click!

### Netlify

1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `build` folder
4. Your app is live!

### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:

   ```json
   "homepage": "https://yourusername.github.io/ai-cooking-coach",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy: `npm run deploy`

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
REACT_APP_GOOGLE_AI_API_KEY=your_google_ai_key_here
```

## 📱 Mobile Optimization

The app is fully responsive and works great on mobile devices. Key features:

- Touch-friendly interface
- Camera access for mobile photography
- Voice commands work on mobile browsers
- Progressive Web App capabilities

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Enable HTTPS in production
- Set up proper CORS policies

## 🎯 Performance Tips

- The app is optimized for fast loading
- Images are compressed automatically
- Lazy loading for better performance
- Service worker for offline capabilities

## 🐛 Troubleshooting

### Common Issues

1. **Camera not working**: Check browser permissions
2. **Voice commands not working**: Ensure HTTPS in production
3. **API errors**: Verify API keys are set correctly
4. **Build failures**: Check for TypeScript errors

### Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure you're using a modern browser
4. Check the README for common solutions

## 🎉 Success

Your AI Cooking Coach app should now be live and ready to help people cook like pros!

Share your deployment URL and let the world experience the future of cooking! 🍳✨
