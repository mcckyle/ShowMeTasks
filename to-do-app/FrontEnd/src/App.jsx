//****************************************************************************************
// Filename: App.jsx
// Date: 6 January 2026
// Author: Kyle McColgan
// Description: This file contains the React entry point for ShowMeTasks.
//****************************************************************************************

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageContainer from "./components/Layout/PageContainer.jsx";
import PrivateRoute from "./components/auth/PrivateRoute";

import ToDoApp from './components/ToDoApp/ToDoApp.jsx';
import Header from "./components/Header/Header.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import HomePage from './components/HomePage/HomePage.jsx';
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Settings from "./components/Settings/Settings.jsx";

import "./App.css";

const App = () => {
      return (	
		  <Router>
		    <div className="app-shell">
			<Header />
			  <main className="app-main">
				<Routes>
				  {/* Public Routes. */}
				  <Route path="/" element={<HomePage />} />
				  <Route path="/tasks" element={<ToDoApp />} />
				  <Route path="/login" element={<Login />} />
				  <Route path="/register" element={<Register />} />

				  {/* Protected Routes. */}
				  <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
				  <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
				  <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />

				  {/* Fallback Route. */}
				  <Route
					path="*"
					element={<h2 className="not-found">Page not found</h2>}
				  />
				</Routes>
			  </main>
			</div>
		  </Router>
		);
};

export default App;
