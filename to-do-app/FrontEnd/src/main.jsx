//****************************************************************************************
// Filename: main.jsx
// Date: 2 January 2026
// Author: Kyle McColgan
// Description: This file contains the React mount point for ShowMeTasks.
//****************************************************************************************

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext';

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
	</AuthProvider>
  </StrictMode>,
)
