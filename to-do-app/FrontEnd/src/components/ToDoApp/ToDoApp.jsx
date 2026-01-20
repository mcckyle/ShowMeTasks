//****************************************************************************************
// Filename: ToDoApp.jsx
// Date: 19 January 2026
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
		  ? "Let's make today productive."
		  : hour < 18
		  ? "Keep going - you're doing great."
		  : "Wrap up your day with intention.";
		
		return `${greeting}! ${message}`;
	};

    return (
		<main className="todo-shell">
			<section className="auth-surface" aria-label="Authentication">
			  <header className="auth-hero">
				<h1 className="auth-title">ShowMeTasks</h1>
				<p className="auth-subtitle">{getGreeting()}</p>
			  </header>
			  
			  <div className="auth-divider" />

			  <div className="auth-forms">
				<Register />
				<Login />
			  </div>
		    </section>
	    </main>
    );
};

export default ToDoApp;