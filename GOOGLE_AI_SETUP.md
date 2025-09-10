# 🔧 Google AI Studio Setup Guide

## 🎯 Hackathon Requirements

Your AI Cooking Coach app now meets all the Google AI Studio Multimodal Challenge requirements:

✅ **Built on Google AI Studio** - Uses Gemini 2.5 Pro/Flash API  
✅ **Deployed using Cloud Run** - Complete Docker and Cloud Run configuration  
✅ **Multimodal functionality** - Image understanding with Gemini 2.5 Flash  
✅ **Free tier support** - Gemini 2.5 Flash Image (free tier available)  

## 🚀 Quick Setup

### 1. Get Google AI Studio API Key

1. **Visit Google AI Studio**
   - Go to [aistudio.google.com](https://aistudio.google.com)
   - Sign in with your Google account

2. **Create API Key**
   - Click "Get API Key" in the left sidebar
   - Create a new API key
   - Copy the API key (starts with `AIza...`)

3. **Set Environment Variable**

   ```bash
   # Create .env file
   cp env.example .env
   
   # Edit .env and add your API key
   REACT_APP_GOOGLE_AI_API_KEY=AIza...your_api_key_here
   ```

### 2. Test Locally

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
# Test the camera and image analysis features
```

### 3. Deploy to Cloud Run

```bash
# Set up Google Cloud CLI
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy to Cloud Run
export REACT_APP_GOOGLE_AI_API_KEY=AIza...your_api_key_here
npm run deploy:cloud-run
```

## 🔍 Multimodal Features

### Image Understanding

- **Ingredient Recognition**: Analyzes photos of ingredients
- **Cooking Progress**: Provides feedback on cooking steps
- **Dish Analysis**: Evaluates finished dishes

### Gemini 2.5 Flash Capabilities

- **High-quality image analysis**
- **Natural language responses**
- **JSON structured output**
- **Fast response times**

## 📊 API Usage

### Free Tier Limits

- **Gemini 2.5 Flash Image**: Free tier available
- **Rate limits**: 15 requests per minute
- **Token limits**: 1M tokens per day

### Production Considerations

- **Rate limiting**: Implement proper error handling
- **Caching**: Cache responses for better performance
- **Fallback**: Mock data when API is unavailable

## 🛠️ Troubleshooting

### Common Issues

1. **API Key Not Working**

   ```bash
   # Check if API key is set
   echo $REACT_APP_GOOGLE_AI_API_KEY
   
   # Verify in .env file
   cat .env
   ```

2. **CORS Errors**
   - Ensure you're using HTTPS in production
   - Check API key permissions in Google AI Studio

3. **Image Upload Issues**
   - Check image format (JPEG, PNG supported)
   - Verify image size (max 10MB)
   - Ensure proper base64 encoding

### Debug Mode

```bash
# Enable debug logging
REACT_APP_DEBUG=true npm start
```

## 🎯 Hackathon Submission

### What to Include

1. **Live Demo URL** - Your Cloud Run deployment
2. **Source Code** - GitHub repository
3. **API Key** - For judges to test
4. **Screenshots** - Show multimodal features

### Presentation Tips

1. **Demo the multimodal features**:
   - Take photo of ingredients
   - Show AI recipe generation
   - Demonstrate cooking feedback
   - Display dish analysis

2. **Highlight technical achievements**:
   - Google AI Studio integration
   - Cloud Run deployment
   - Real-time image analysis
   - Voice interaction

3. **Show real-world impact**:
   - Makes cooking accessible
   - Reduces food waste
   - Improves cooking skills
   - Works on mobile devices

## 🏆 Why This Will Win

### Technical Excellence

- **Cutting-edge AI**: Uses latest Gemini 2.5 Flash
- **Cloud-native**: Deployed on Google Cloud Run
- **Multimodal**: Real image understanding
- **Scalable**: Production-ready architecture

### Innovation

- **First-of-its-kind**: Multimodal cooking assistant
- **Real problem solving**: Addresses actual cooking needs
- **Accessibility**: Voice and visual interaction
- **Mobile-first**: Works on all devices

### User Experience

- **Intuitive interface**: Easy to use
- **Real-time feedback**: Instant AI responses
- **Beautiful design**: Modern, responsive UI
- **Accessibility**: Voice commands and audio

## 🎉 Ready to Win

Your AI Cooking Coach is now fully compliant with all hackathon requirements and ready to impress the judges!

**Key Features to Demo:**

- 📸 Take photo of ingredients → Get AI recipe
- 🎤 Voice commands during cooking
- 📱 Real-time cooking feedback
- 🍳 Dish analysis and ratings

**Deploy and share your Cloud Run URL to start winning! 🏆**
