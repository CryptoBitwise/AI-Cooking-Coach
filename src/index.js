import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TestApp from './TestApp';
// import App from './App';
// import * as serviceWorker from './registerSW';

console.log('Index.js loading...');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <TestApp />
    </React.StrictMode>
);

// Register service worker for offline capabilities
// serviceWorker.register();
