import React, { useState } from 'react';
import AICookingCoach from './components/AICookingCoach';
import DemoPage from './components/DemoPage';

function App() {
    const [showDemo, setShowDemo] = useState(false);

    return (
        <div className="App">
            {showDemo ? (
                <DemoPage onStartCooking={() => setShowDemo(false)} />
            ) : (
                <div>
                    <div className="fixed top-4 right-4 z-50">
                        <button
                            onClick={() => setShowDemo(!showDemo)}
                            className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                        >
                            {showDemo ? '🍳 Start Cooking' : '📱 View Demo'}
                        </button>
                    </div>
                    <AICookingCoach />
                </div>
            )}
        </div>
    );
}

export default App;
