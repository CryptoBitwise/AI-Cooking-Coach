import React, { useState } from 'react';
import { Play, Camera, Mic, Sparkles, ChefHat, Clock, Users, Star } from 'lucide-react';

const DemoPage = ({ onStartCooking }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const features = [
        {
            icon: <Camera className="w-8 h-8 text-blue-500" />,
            title: "Smart Ingredient Recognition",
            description: "Take photos of your ingredients and get AI-powered recipe suggestions instantly."
        },
        {
            icon: <ChefHat className="w-8 h-8 text-orange-500" />,
            title: "Step-by-Step Guidance",
            description: "Follow interactive cooking steps with real-time progress tracking and tips."
        },
        {
            icon: <Mic className="w-8 h-8 text-purple-500" />,
            title: "Voice Commands",
            description: "Hands-free cooking with voice recognition and audio feedback."
        },
        {
            icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
            title: "AI Analysis",
            description: "Get feedback on your cooking progress and finished dishes."
        }
    ];

    const stats = [
        { icon: <Users className="w-6 h-6" />, value: "10K+", label: "Happy Cooks" },
        { icon: <Clock className="w-6 h-6" />, label: "Avg. Time Saved", value: "30min" },
        { icon: <Star className="w-6 h-6" />, label: "Success Rate", value: "95%" }
    ];

    return (
        <div className="min-h-screen gradient-bg cooking-pattern">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-shadow">
                            🍳 AI Cooking Coach
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            The future of cooking is here! Transform your kitchen with AI-powered guidance,
                            voice commands, and real-time feedback. Cook like a pro with confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={onStartCooking}
                                className="btn-primary text-lg px-8 py-4"
                            >
                                Start Cooking Now
                            </button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                Watch Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Revolutionary Cooking Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience the next generation of cooking assistance with multimodal AI technology
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-white">
                                <div className="flex justify-center mb-4">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-xl opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Three simple steps to cooking perfection
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Snap Your Ingredients
                            </h3>
                            <p className="text-gray-600">
                                Take a photo of your ingredients and let AI suggest the perfect recipe
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Follow AI Guidance
                            </h3>
                            <p className="text-gray-600">
                                Get step-by-step instructions with voice commands and real-time feedback
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Share Your Success
                            </h3>
                            <p className="text-gray-600">
                                Show off your masterpiece and get AI analysis on your cooking skills
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Ready to Cook Like a Pro?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of home cooks who are already using AI to elevate their cooking game
                    </p>
                    <button
                        onClick={onStartCooking}
                        className="btn-primary text-xl px-12 py-4"
                    >
                        Get Started Free
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">🍳 AI Cooking Coach</h3>
                    <p className="text-gray-400 mb-6">
                        Built for the Google AI Studio Multimodal Challenge
                    </p>
                    <div className="text-sm text-gray-500">
                        © 2024 AI Cooking Coach. Made with ❤️ for the hackathon.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoPage;
