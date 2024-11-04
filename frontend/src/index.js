import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(`${process.env.PUBLIC_URL}/service-worker.js`)
            .then(registration => console.log('Service Worker registered:', registration))
            .catch(error => console.log('Service Worker registration failed:', error));
    });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
