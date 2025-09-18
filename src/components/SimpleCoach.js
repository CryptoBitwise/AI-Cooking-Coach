import React, { useState, useRef } from 'react';
import { Camera, Upload, ChefHat, Loader2 } from 'lucide-react';

const SimpleCoach = () => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState(null);

    // Real AI analysis function using Netlify Function
    const analyzeImageWithAI = async (imageData) => {
        try {
            setError(null);
            setIsProcessing(true);

            const netlifyResp = await fetch('/.netlify/functions/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageData, currentStep: 'ingredients' })
            });

            if (!netlifyResp.ok) {
                const errorText = await netlifyResp.text();
                console.error('Netlify function error:', netlifyResp.status, errorText);
                throw new Error(`Function error ${netlifyResp.status}: ${errorText}`);
            }

            const data = await netlifyResp.json();

            // Netlify function returns the parsed analysis payload directly
            setRecipe({
                name: data.recipe?.name || 'AI Recipe',
                description: data.recipe?.description,
                ingredients: data.ingredients || data.recipe?.ingredients || [],
                steps: data.recipe?.steps || [],
                cookingTime: data.recipe?.cookingTime || '—',
                difficulty: data.recipe?.difficulty || '—',
                servings: data.recipe?.servings || '—',
                tips: data.tips || data.recipe?.tips || []
            });
            setIsProcessing(false);

        } catch (error) {
            console.error('AI Analysis Error:', error);
            setError(`AI analysis failed: ${error.message}`);
            setIsProcessing(false);

            // Fallback to mock data
            setRecipe({
                name: "Fallback Recipe",
                description: "AI analysis failed, showing sample recipe",
                ingredients: ["Sample ingredients from image"],
                steps: ["Analyze your ingredients", "Follow basic cooking principles", "Season to taste"],
                cookingTime: "15 minutes",
                difficulty: "Easy",
                servings: "2-4 servings",
                tips: ["Use fresh ingredients", "Taste as you cook"]
            });
        }
    };

    const startCamera = async () => {
        try {
            // iOS Safari reliability tweaks: prefer ideal constraint, ensure user gesture triggers
            const constraints = {
                audio: false,
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            const stream = await (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
                ? navigator.mediaDevices.getUserMedia(constraints)
                : Promise.reject(new Error('Camera not supported'));
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Critical: wait for metadata before playing
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                };
                setIsCameraActive(true);
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to start camera. Try Upload Photo instead.');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            setIsCameraActive(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            
            // Check if video is ready
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.log('Video not ready, waiting...');
                setTimeout(capturePhoto, 100);
                return;
            }
            
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            try {
                context.drawImage(video, 0, 0);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            setCapturedImage(e.target.result);
                            // Real AI analysis
                            analyzeImageWithAI(e.target.result);
                        };
                        reader.readAsDataURL(blob);
                    } else {
                        console.error('Failed to create blob from canvas');
                        alert('Failed to capture photo. Please try again.');
                    }
                }, 'image/jpeg', 0.8);
                
                stopCamera();
            } catch (error) {
                console.error('Error capturing photo:', error);
                alert('Error capturing photo. Please try again.');
            }
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCapturedImage(e.target.result);
                // Real AI analysis
                analyzeImageWithAI(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f0f8ff' }}>
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                        🍳 AI Cooking Coach
                    </h1>
                    <p style={{ color: '#666' }}>Multimodal cooking assistant powered by AI</p>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <ChefHat style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#ff6b35' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>What's in your kitchen?</h2>
                        <p style={{ color: '#666', marginTop: '8px' }}>Take a photo of your ingredients and I'll suggest a recipe!</p>
                    </div>

                    {!capturedImage && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <button
                                onClick={startCamera}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    padding: '16px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                <Camera style={{ width: '20px', height: '20px' }} />
                                Use Camera
                            </button>

                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                padding: '16px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}>
                                <Upload style={{ width: '20px', height: '20px' }} />
                                Upload Photo
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    )}

                    {isCameraActive && (
                        <div style={{ marginTop: '24px' }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{ width: '100%', maxWidth: '400px', margin: '0 auto', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                                <button
                                    onClick={capturePhoto}
                                    style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    📸 Capture Photo
                                </button>
                                <button
                                    onClick={stopCamera}
                                    style={{
                                        backgroundColor: '#6b7280',
                                        color: 'white',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {capturedImage && (
                        <div style={{ marginTop: '24px' }}>
                            <img
                                src={capturedImage}
                                alt="Captured ingredients"
                                style={{ width: '100%', maxWidth: '400px', margin: '0 auto', borderRadius: '8px' }}
                            />

                            {isProcessing && (
                                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                    <Loader2 style={{ width: '32px', height: '32px', margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
                                    <p style={{ color: '#666' }}>AI is analyzing your ingredients...</p>
                                </div>
                            )}

                            {error && (
                                <div style={{
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    color: '#dc2626',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    marginTop: '16px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
                                </div>
                            )}

                            {recipe && !isProcessing && (
                                <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                                        {recipe.name}
                                    </h3>
                                    {recipe.description && (
                                        <p style={{ color: '#666', marginBottom: '16px', fontStyle: 'italic' }}>
                                            {recipe.description}
                                        </p>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                                        <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
                                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>⏱️</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>Time</div>
                                            <div style={{ fontWeight: 'bold' }}>{recipe.cookingTime}</div>
                                        </div>
                                        <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
                                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>👥</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>Servings</div>
                                            <div style={{ fontWeight: 'bold' }}>{recipe.servings}</div>
                                        </div>
                                        <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
                                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📊</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>Difficulty</div>
                                            <div style={{ fontWeight: 'bold' }}>{recipe.difficulty}</div>
                                        </div>
                                    </div>

                                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                                        <div style={{ marginBottom: '20px' }}>
                                            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>📋 Ingredients:</h4>
                                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                {recipe.ingredients.map((ingredient, index) => (
                                                    <li key={index} style={{ marginBottom: '4px', color: '#555' }}>{ingredient}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>👨‍🍳 Cooking Steps:</h4>
                                        <ol style={{ paddingLeft: '20px', margin: 0 }}>
                                            {recipe.steps.map((step, index) => (
                                                <li key={index} style={{ marginBottom: '8px', color: '#555', lineHeight: '1.4' }}>
                                                    <strong>Step {index + 1}:</strong> {step}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>

                                    {recipe.tips && recipe.tips.length > 0 && (
                                        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#e0f2fe', borderRadius: '6px' }}>
                                            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#0277bd' }}>💡 Pro Tips:</h4>
                                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                {recipe.tips.map((tip, index) => (
                                                    <li key={index} style={{ marginBottom: '4px', color: '#01579b', fontSize: '14px' }}>{tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => {
                                                // Start cooking logic here
                                                alert('Cooking mode activated! Follow the steps above.');
                                            }}
                                            style={{
                                                backgroundColor: '#ff6b35',
                                                color: 'white',
                                                padding: '12px 24px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Start Cooking! 👨‍🍳
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCapturedImage(null);
                                                setRecipe(null);
                                                setError(null);
                                            }}
                                            style={{
                                                backgroundColor: '#6b7280',
                                                color: 'white',
                                                padding: '12px 24px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '16px'
                                            }}
                                        >
                                            Try Another Image 📸
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#999' }}>
                    Built for Google AI Studio Multimodal Challenge
                </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default SimpleCoach;

