
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Set up the root element for React
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Render the App component within the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
