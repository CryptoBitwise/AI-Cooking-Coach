# 🍳 AI Cooking Coach

A revolutionary multimodal cooking assistant that uses AI to help you cook like a pro! Take photos of your ingredients, get personalized recipes, and receive real-time cooking guidance through voice and visual feedback.

## ✨ Features

### 🎯 Core Functionality

- **Ingredient Recognition**: Take photos of your ingredients and get AI-powered recipe suggestions
- **Step-by-Step Guidance**: Interactive cooking steps with progress tracking
- **Real-time Feedback**: Photo analysis during cooking for quality assurance
- **Voice Commands**: Hands-free cooking with voice recognition
- **Text-to-Speech**: Audio feedback for accessibility

### 🚀 Advanced Features

- **Multimodal AI**: Combines computer vision and natural language processing
- **Progressive Web App**: Works on mobile and desktop
- **Responsive Design**: Beautiful UI that adapts to any screen size
- **Real-time Camera**: Live camera feed with photo capture
- **File Upload**: Alternative to camera for ingredient photos
- **Cooking Progress**: Track your progress through recipe steps
- **Dish Analysis**: Get feedback on your finished dishes

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **AI Integration**: Google AI Studio with Gemini 2.5 Pro/Flash
- **Deployment**: Google Cloud Run
- **Voice**: Web Speech API
- **Camera**: MediaDevices API
- **Multimodal**: Image understanding with Gemini 2.5 Flash

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Modern browser with camera access
- Google Cloud account
- Google AI Studio API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ai-cooking-coach
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env and add your Google AI Studio API key
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Deploying to Google Cloud Run

1. **Set up Google Cloud**

   ```bash
   # Install Google Cloud CLI
   # Visit: https://cloud.google.com/sdk/docs/install
   
   # Authenticate
   gcloud auth login
   
   # Set project
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Deploy to Cloud Run**

   ```bash
   # Set your Google AI API key
   export REACT_APP_GOOGLE_AI_API_KEY=your_api_key_here
   
   # Deploy using the script
   npm run deploy:cloud-run
   ```

3. **Alternative: Manual deployment**

   ```bash
   # Build Docker image
   npm run build:docker
   
   # Tag and push to Container Registry
   docker tag ai-cooking-coach gcr.io/YOUR_PROJECT_ID/ai-cooking-coach
   docker push gcr.io/YOUR_PROJECT_ID/ai-cooking-coach
   
   # Deploy to Cloud Run
   gcloud run deploy ai-cooking-coach \
     --image gcr.io/YOUR_PROJECT_ID/ai-cooking-coach \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## 🎯 How to Use

### 1. Ingredients Phase

- Take a photo of your ingredients or upload an image
- AI analyzes the ingredients and suggests a recipe
- Review the suggested recipe and cooking time

### 2. Cooking Phase

- Follow the step-by-step recipe instructions
- Take progress photos for AI feedback
- Use voice commands for hands-free guidance
- Track your progress through each step

### 3. Finished Phase

- Take a photo of your completed dish
- Get AI analysis on presentation and quality
- Receive nutritional insights and ratings

## 🎤 Voice Commands

- "Next step" or "Continue" - Move to next recipe step
- "Previous step" or "Go back" - Return to previous step
- "Start cooking" - Begin cooking phase
- "Take photo" or "Capture" - Take a photo

## 🔧 Configuration

### API Keys

To use real AI analysis, add your API keys to the environment:

```bash
# Create .env file
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
```

### Camera Permissions

The app requires camera access for photo capture. Make sure to allow camera permissions when prompted.

## 📱 Mobile Support

- Responsive design works on all screen sizes
- Touch-friendly interface
- Camera access for mobile photography
- Voice commands work on mobile browsers

## 🎨 Customization

### Styling

The app uses Tailwind CSS with custom components. You can customize:

- Colors in `tailwind.config.js`
- Animations in `src/index.css`
- Component styles in the component files

### AI Prompts

Modify the AI analysis prompts in `src/components/AICookingCoach.js` to customize the AI responses.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Netlify

1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify

### Other Platforms

The app can be deployed to any static hosting service that supports React.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Submission

This project was built for the Google AI Studio Multimodal Challenge and demonstrates:

- Advanced multimodal AI integration
- Real-time computer vision
- Voice interaction capabilities
- Progressive web app features
- Beautiful, responsive UI/UX

## 🙏 Acknowledgments

- Google AI Studio for the multimodal AI capabilities
- Anthropic for Claude Sonnet 4 integration
- The React and Tailwind CSS communities
- All the amazing open-source libraries used

---

**Made with ❤️ for the Google AI Studio Multimodal Challenge**
