import React from 'react';

const TestApp = () => {
    console.log('TestApp rendering...');
    
    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <h1 style={{ color: 'red', fontSize: '2rem' }}>🧪 TEST APP - If you see this, React is working!</h1>
            <p>This is a simple test to see if React is rendering properly.</p>
            <button 
                onClick={() => alert('Button clicked! React is working!')}
                style={{ 
                    padding: '10px 20px', 
                    backgroundColor: 'blue', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Test Button
            </button>
        </div>
    );
};

export default TestApp;
