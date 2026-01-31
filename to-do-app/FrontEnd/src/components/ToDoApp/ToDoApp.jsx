//****************************************************************************************
// Filename: ToDoApp.jsx
// Date: 29 January 2026
// Author: Kyle McColgan
// Description: This file contains the React parent component for ShowMeTasks.
//****************************************************************************************

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Register from "../Register/Register.jsx";
import Login from "../Login/Login.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import "./ToDoApp.css";

const ToDoApp = () => {
    const { user } = useContext(AuthContext);
	
	if (user)
	{
		return <Dashboard user={user} />;
	}
	
	const getGreeting = () => {
		const hour = new Date().getHours();
		const greeting =
		  hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

		// Add a motivational message based on the time of day
		const message =
		  hour < 12
		  ? "Plan your day with clarity."
		  : hour < 18
		  ? "Focus on what matters most."
		  : "Capture what's important before you sign off.";
		
		return `${greeting}! ${message}`;
	};

    return (
		<main className="todo-shell">
			<section className="auth-surface" aria-label="Authentication">
			  <header className="auth-hero">
				<h1 className="auth-title">ShowMeTasks</h1>
				<p className="auth-subtitle" aria-live="polite">
				  {getGreeting()}
				</p>
			  </header>
			  
			  <div className="auth-forms">
				<Register />
				<Login />
			  </div>
		    </section>
	    </main>
    );
};

export default ToDoApp;