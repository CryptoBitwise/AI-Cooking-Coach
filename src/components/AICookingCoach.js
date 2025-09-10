import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Mic, MicOff, ChefHat, Sparkles, Clock, CheckCircle, Volume2, Star, Heart, ThumbsUp, Award, Share2, AlertCircle, Zap } from 'lucide-react';

const AICookingCoach = () => {
    const [currentStep, setCurrentStep] = useState('ingredients'); // ingredients, cooking, finished
    const [isProcessing, setIsProcessing] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioQueue, setAudioQueue] = useState([]);
    const [showTutorial, setShowTutorial] = useState(true);
    // const [cookingPhotos, setCookingPhotos] = useState([]);
    // const [successSteps, setSuccessSteps] = useState(new Set());
    const [showNutrition, setShowNutrition] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    // Voice functionality
    const handleVoiceCommand = useCallback((transcript) => {
        const command = transcript.toLowerCase();

        if (command.includes('next step') || command.includes('continue')) {
            if (currentStep === 'cooking' && recipe) {
                setCurrentStepIndex(prev => Math.min(prev + 1, recipe.steps.length - 1));
            }
        } else if (command.includes('previous step') || command.includes('go back')) {
            if (currentStep === 'cooking' && recipe) {
                setCurrentStepIndex(prev => Math.max(prev - 1, 0));
            }
        } else if (command.includes('start cooking')) {
            setCurrentStep('cooking');
        } else if (command.includes('take photo') || command.includes('capture')) {
            if (isCameraActive) {
                capturePhoto();
            } else {
                startCamera();
            }
        }
    }, [currentStep, recipe, isCameraActive, capturePhoto, startCamera]);

    // Enhanced AI Analysis using Google AI Studio with Gemini 2.5 Pro/Flash
    const analyzeImage = useCallback(async (imageData) => {
        setIsProcessing(true);

        try {
            // Convert base64 to proper format for Gemini
            const base64Data = imageData.split(',')[1];

            let prompt = '';
            if (currentStep === 'ingredients') {
                prompt = `Analyze this image of ingredients and suggest a delicious recipe. 
        Please provide:
        1. List of ingredients you can identify
        2. A complete recipe with steps
        3. Estimated cooking time
        4. Difficulty level
        5. Nutritional highlights
        
        Respond in JSON format:
        {
          "ingredients": ["ingredient1", "ingredient2"],
          "recipe": {
            "name": "Recipe Name",
            "steps": ["step1", "step2"],
            "cookingTime": "30 minutes",
            "difficulty": "Easy",
            "nutrition": "High in protein, low in carbs"
          }
        }`;
            } else if (currentStep === 'cooking') {
                prompt = `Analyze this cooking progress photo and provide feedback.
        Is this step completed correctly? What should the user do next?
        
        Respond in JSON format:
        {
          "feedback": "Detailed feedback about the cooking progress",
          "nextStep": "What to do next",
          "looksgood": true/false,
          "tips": ["tip1", "tip2"]
        }`;
            } else {
                prompt = `Analyze this finished dish photo and provide a comprehensive evaluation.
        
        Respond in JSON format:
        {
          "overallScore": 4.2,
          "socialMediaWorthy": true,
          "presentation": {
            "score": 4.5,
            "strengths": ["Beautiful plating", "Great color contrast"],
            "improvements": ["Add garnish", "Better lighting"]
          },
          "cookingQuality": {
            "score": 4.0,
            "assessment": "Well-cooked with good technique"
          },
          "nutrition": {
            "estimatedCalories": "450-500",
            "healthScore": 4.2,
            "macros": "High protein, moderate carbs, good fats"
          },
          "compliments": "Excellent work! This looks restaurant-quality.",
          "improvementTips": ["Try adding fresh herbs", "Consider plating height"]
        }`;
            }

            // Use Google AI Studio with Gemini 2.5 Pro/Flash
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.REACT_APP_GOOGLE_AI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: prompt
                            },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Data
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Google AI API error: ${response.status}`);
            }

            const data = await response.json();
            let responseText = data.candidates[0].content.parts[0].text;

            // Clean up response and parse JSON
            responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            const analysisData = JSON.parse(responseText);

            setAnalysisResult(analysisData);

            if (currentStep === 'ingredients' && analysisData.recipe) {
                setRecipe(analysisData.recipe);
            }

            // Add to audio queue for text-to-speech
            if (analysisData.feedback || analysisData.presentation) {
                addToAudioQueue(analysisData.feedback || analysisData.presentation);
            }

        } catch (error) {
            console.error('Error analyzing image:', error);
            // Fallback to mock data if API fails
            const mockResponse = await mockAIAnalysis(currentStep, imageData);
            setAnalysisResult(mockResponse);

            if (currentStep === 'ingredients' && mockResponse.recipe) {
                setRecipe(mockResponse.recipe);
            }
        }

        setIsProcessing(false);
    }, [currentStep]);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                handleVoiceCommand(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [handleVoiceCommand]);

    // Camera functionality
    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Use back camera on mobile
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Camera access denied. Please use file upload instead.');
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            setIsCameraActive(false);
        }
    }, []);

    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setCapturedImage(e.target.result);
                    analyzeImage(e.target.result);
                };
                reader.readAsDataURL(blob);
            }, 'image/jpeg', 0.8);

            stopCamera();
        }
    }, [analyzeImage, stopCamera]);

    // File upload handler
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCapturedImage(e.target.result);
                analyzeImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Mock AI Analysis for demo
    const mockAIAnalysis = async (step, imageData) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (step === 'ingredients') {
            return {
                ingredients: ['Chicken breast', 'Bell peppers', 'Onions', 'Garlic', 'Olive oil', 'Salt', 'Pepper'],
                recipe: {
                    name: 'Mediterranean Chicken Stir-Fry',
                    steps: [
                        'Heat olive oil in a large pan over medium-high heat',
                        'Season chicken with salt and pepper, then add to pan',
                        'Cook chicken for 5-6 minutes until golden brown',
                        'Add sliced bell peppers and onions to the pan',
                        'Add minced garlic and cook for 2-3 minutes',
                        'Stir everything together and cook for another 2 minutes',
                        'Serve hot with rice or quinoa'
                    ],
                    cookingTime: '20 minutes',
                    difficulty: 'Easy',
                    nutrition: 'High in protein, rich in vitamins A and C'
                }
            };
        } else if (step === 'cooking') {
            return {
                feedback: 'Great job! The chicken is nicely browned and the vegetables are starting to soften. The colors look vibrant and fresh.',
                nextStep: 'Add the garlic now and stir everything together for 2-3 minutes',
                looksgood: true,
                tips: ['Keep stirring to prevent burning', 'Add a splash of water if needed']
            };
        } else {
            return {
                presentation: 'Beautiful presentation! The colors are vibrant and the dish looks appetizing.',
                cookingQuality: 'Excellent cooking technique - chicken is perfectly cooked and vegetables are crisp-tender.',
                nutrition: 'This dish provides a good balance of protein, vitamins, and minerals.',
                rating: 9.2
            };
        }
    };

    // Voice functionality
    const toggleVoiceRecording = () => {
        if (isListening) {
            // Stop recording
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsListening(false);
        } else {
            // Start recording
            if (recognitionRef.current) {
                recognitionRef.current.start();
                setIsListening(true);
            } else {
                alert('Speech recognition not supported in this browser');
            }
        }
    };

    // Audio functionality
    const addToAudioQueue = (text) => {
        setAudioQueue(prev => [...prev, text]);
    };

    const playNextAudio = useCallback(() => {
        if (audioQueue.length > 0) {
            const text = audioQueue[0];
            setAudioQueue(prev => prev.slice(1));

            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.onend = () => {
                    setIsPlayingAudio(false);
                    if (audioQueue.length > 0) {
                        setTimeout(playNextAudio, 500);
                    }
                };
                speechSynthesis.speak(utterance);
                setIsPlayingAudio(true);
            }
        }
    }, [audioQueue]);

    useEffect(() => {
        if (audioQueue.length > 0 && !isPlayingAudio) {
            playNextAudio();
        }
    }, [audioQueue, isPlayingAudio, playNextAudio]);

    const renderTutorial = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md">
                <h3 className="text-xl font-bold mb-4">Welcome to AI Cooking Coach! 👨‍🍳</h3>
                <div className="space-y-3 text-sm text-gray-600">
                    <p>• Take photos of your ingredients to get recipe suggestions</p>
                    <p>• Use voice commands during cooking for hands-free guidance</p>
                    <p>• Get real-time feedback on your cooking progress</p>
                    <p>• Share your finished dishes for analysis</p>
                </div>
                <button
                    onClick={() => setShowTutorial(false)}
                    className="btn-primary w-full mt-4"
                >
                    Let's Start Cooking!
                </button>
            </div>
        </div>
    );

    const renderIngredientsStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <ChefHat className="w-16 h-16 mx-auto text-orange-500 mb-4 animate-float" />
                <h2 className="text-2xl font-bold text-gray-800 text-shadow">What's in your kitchen?</h2>
                <p className="text-gray-600 mt-2">Take a photo of your ingredients and I'll suggest a recipe!</p>
            </div>

            {!capturedImage && (
                <div className="space-y-4">
                    {!isCameraActive ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={startCamera}
                                className="btn-secondary flex items-center justify-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                Use Camera
                            </button>
                            <label className="btn-primary flex items-center justify-center gap-2 cursor-pointer">
                                <Upload className="w-5 h-5" />
                                Upload Photo
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                            />
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={capturePhoto}
                                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    📸 Capture Photo
                                </button>
                                <button
                                    onClick={stopCamera}
                                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {capturedImage && (
                <div className="space-y-4">
                    <img src={capturedImage} alt="Captured ingredients" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />

                    {isProcessing && (
                        <div className="text-center">
                            <Sparkles className="w-8 h-8 mx-auto text-yellow-500 animate-spin mb-2" />
                            <p className="text-gray-600">Analyzing your ingredients...</p>
                        </div>
                    )}

                    {analysisResult && !isProcessing && (
                        <div className="card">
                            {analysisResult.error ? (
                                <p className="text-red-500">{analysisResult.error}</p>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800">Ingredients Found:</h3>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {analysisResult.ingredients?.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>

                                    {recipe && (
                                        <div className="mt-6">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Recipe: {recipe.name}</h3>
                                            <div className="flex gap-4 text-sm text-gray-600 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {recipe.cookingTime}
                                                </span>
                                                <span>Difficulty: {recipe.difficulty}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">{recipe.nutrition}</p>

                                            <button
                                                onClick={() => setCurrentStep('cooking')}
                                                className="btn-primary w-full"
                                            >
                                                Start Cooking! 👨‍🍳
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );

    const renderCookingStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 text-shadow">Cooking: {recipe?.name}</h2>
                <p className="text-gray-600 mt-2">Take photos of your progress and I'll guide you!</p>
            </div>

            {recipe && (
                <div className="card">
                    <h3 className="text-lg font-bold mb-4">Recipe Steps:</h3>
                    <div className="space-y-3">
                        {recipe.steps?.map((step, index) => (
                            <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${index === currentStepIndex ? 'bg-orange-100 border-l-4 border-orange-500' : 'bg-gray-50'
                                }`}>
                                <span className="text-orange-500 font-bold text-lg">{index + 1}</span>
                                <span className="flex-1 text-gray-700">{step}</span>
                                {index < currentStepIndex && (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
                            disabled={currentStepIndex === 0}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Step {currentStepIndex + 1} of {recipe.steps.length}
                        </span>
                        <button
                            onClick={() => setCurrentStepIndex(prev => Math.min(prev + 1, recipe.steps.length - 1))}
                            disabled={currentStepIndex === recipe.steps.length - 1}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={startCamera}
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <Camera className="w-5 h-5" />
                        Check My Progress
                    </button>
                    <button
                        onClick={toggleVoiceRecording}
                        className={`flex items-center justify-center gap-2 px-6 py-4 rounded-lg transition-colors ${isListening
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                            }`}
                    >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        {isListening ? 'Stop Recording' : 'Voice Question'}
                    </button>
                </div>

                {isPlayingAudio && (
                    <div className="flex items-center justify-center gap-2 text-orange-600">
                        <Volume2 className="w-4 h-4 animate-pulse" />
                        <span className="text-sm">Playing audio feedback...</span>
                    </div>
                )}

                <button
                    onClick={() => setCurrentStep('finished')}
                    className="btn-primary w-full"
                >
                    I'm Done Cooking! 🍽️
                </button>
            </div>
        </div>
    );

    const renderFinishedStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-gray-800 text-shadow">Congratulations, Chef!</h2>
                <p className="text-gray-600 mt-2">Show me your culinary masterpiece for a professional analysis</p>
            </div>

            {!capturedImage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={startCamera}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                    >
                        <Camera className="w-5 h-5" />
                        📸 Photo My Masterpiece
                    </button>
                    <label className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 cursor-pointer shadow-lg">
                        <Upload className="w-5 h-5" />
                        📁 Upload Final Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>
            )}

            {capturedImage && (
                <div className="space-y-6">
                    <div className="relative">
                        <img src={capturedImage} alt="Finished dish" className="w-full max-w-lg mx-auto rounded-lg shadow-xl" />
                        <button
                            onClick={() => { setCapturedImage(null); setAnalysisResult(null); }}
                            className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                            ✕
                        </button>
                    </div>

                    {isProcessing && (
                        <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
                            <Sparkles className="w-16 h-16 mx-auto text-purple-500 animate-spin mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Master Chef AI is analyzing...</h3>
                            <p className="text-gray-600">Evaluating presentation, technique, and overall awesomeness!</p>
                        </div>
                    )}

                    {analysisResult && !isProcessing && (
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                            {analysisResult.error ? (
                                <div className="p-6 text-center">
                                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                                    <p className="text-red-600 text-lg">{analysisResult.error}</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Header with Overall Score */}
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 text-center">
                                        <div className="text-6xl mb-4">
                                            {analysisResult.overallScore >= 4.5 ? '🏆' :
                                                analysisResult.overallScore >= 4.0 ? '🥇' :
                                                    analysisResult.overallScore >= 3.5 ? '🥈' :
                                                        analysisResult.overallScore >= 3.0 ? '🥉' : '⭐'}
                                        </div>
                                        <h3 className="text-3xl font-bold mb-2">Overall Score: {analysisResult.overallScore}/5</h3>
                                        <div className="flex justify-center mb-4">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`w-8 h-8 ${star <= Math.floor(analysisResult.overallScore) ? 'text-white fill-current' : 'text-yellow-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {analysisResult.socialMediaWorthy && (
                                            <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 inline-flex items-center gap-2">
                                                <Share2 className="w-5 h-5" />
                                                <span className="font-semibold">Social Media Ready! 📱</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Presentation Analysis */}
                                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                                            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                                                <Heart className="w-6 h-6 text-pink-500" />
                                                Presentation Score: {analysisResult.presentation?.score}/5
                                            </h4>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h5 className="font-semibold text-green-700 mb-2">✨ What's Great:</h5>
                                                    <ul className="space-y-1">
                                                        {analysisResult.presentation?.strengths?.map((strength, index) => (
                                                            <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                                                                <ThumbsUp className="w-4 h-4 text-green-500" />
                                                                {strength}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {analysisResult.presentation?.improvements?.length > 0 && (
                                                    <div>
                                                        <h5 className="font-semibold text-orange-700 mb-2">💡 Level Up Ideas:</h5>
                                                        <ul className="space-y-1">
                                                            {analysisResult.presentation.improvements.map((improvement, index) => (
                                                                <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                                                                    <Sparkles className="w-4 h-4 text-orange-500" />
                                                                    {improvement}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cooking Quality */}
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                                            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                                                <ChefHat className="w-6 h-6 text-blue-500" />
                                                Cooking Technique: {analysisResult.cookingQuality?.score}/5
                                            </h4>
                                            <p className="text-gray-700">{analysisResult.cookingQuality?.assessment}</p>
                                        </div>

                                        {/* Nutrition */}
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                                            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                                                <Award className="w-6 h-6 text-green-500" />
                                                Nutrition Analysis
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Estimated Calories</p>
                                                    <p className="font-semibold text-gray-800">{analysisResult.nutrition?.estimatedCalories}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Health Score</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-800">{analysisResult.nutrition?.healthScore}/5</span>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-4 h-4 ${star <= Math.floor(analysisResult.nutrition?.healthScore || 0)
                                                                        ? 'text-green-500 fill-current'
                                                                        : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 mt-2">{analysisResult.nutrition?.macros}</p>
                                        </div>

                                        {/* Chef's Compliments */}
                                        {analysisResult.compliments && (
                                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border-l-4 border-yellow-500">
                                                <h4 className="font-bold text-yellow-800 mb-2">👨‍🍳 Chef's Special Mention</h4>
                                                <p className="text-yellow-700 italic">"{analysisResult.compliments}"</p>
                                            </div>
                                        )}

                                        {/* Improvement Tips */}
                                        {analysisResult.improvementTips && analysisResult.improvementTips.length > 0 && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-800 mb-3">🚀 Next Level Tips</h4>
                                                <ul className="space-y-2">
                                                    {analysisResult.improvementTips.map((tip, index) => (
                                                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                                            <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => {
                        setCapturedImage(null);
                        setAnalysisResult(null);
                        setRecipe(null);
                        // setCookingPhotos([]);
                        // setSuccessSteps(new Set());
                        setCurrentStepIndex(0);
                        setCurrentStep('ingredients');
                    }}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 shadow-lg"
                >
                    🔄 Cook Something Else
                </button>

                <button
                    onClick={() => setShowNutrition(!showNutrition)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg"
                >
                    📊 {showNutrition ? 'Hide' : 'Show'} Detailed Nutrition
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen gradient-bg cooking-pattern p-4">
            {showTutorial && renderTutorial()}

            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 text-shadow">
                        🍳 AI Cooking Coach
                    </h1>
                    <p className="text-gray-600">Multimodal cooking assistant powered by AI</p>
                </div>

                <div className="card">
                    {currentStep === 'ingredients' && renderIngredientsStep()}
                    {currentStep === 'cooking' && renderCookingStep()}
                    {currentStep === 'finished' && renderFinishedStep()}
                </div>

                <div className="text-center mt-6 text-sm text-gray-500">
                    Built for Google AI Studio Multimodal Challenge
                </div>
            </div>
        </div>
    );
};

export default AICookingCoach;
