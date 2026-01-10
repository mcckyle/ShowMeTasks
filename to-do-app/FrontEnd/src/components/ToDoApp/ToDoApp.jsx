//****************************************************************************************
// Filename: ToDoApp.jsx
// Date: 6 January 2026
// Author: Kyle McColgan
// Description: This file contains the React parent component for ShowMeTasks.
//****************************************************************************************

import React, { useContext } from "react";
import Register from "../Register/Register.jsx";
import Login from "../Login/Login.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import { AuthContext } from "../../context/AuthContext";
import { Container, Typography, Card, Divider } from "@mui/material";
import "./ToDoApp.css";

const ToDoApp = () => {
    const { user } = useContext(AuthContext);
	
	const getGreeting = () => {
		const hour = new Date().getHours();
		const greetingTime = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

		// Add a motivational message based on the time of day
		const motivationalMessage = hour < 12 ? "Let's make today productive!" : hour < 18 ? "Keep going, you're doing great!" : "Wrap up your day with some tasks!";
		
		return `${greetingTime}! ${motivationalMessage}`;
	};

    return (
		<Container className="todo-shell" maxWidth="sm">
		  {!user ? (
			<Card className="auth-surface" elevation={0}>
			  <header className="auth-hero">
				<Typography variant="h4" component="h1">
					ShowMeTasks
				</Typography>
				<Typography className="hero-subtitle">
					A focused space to organize what matters today.
				</Typography>
			  </header>
			  
			  <Divider />

			<section className="auth-forms">
				<Register />
				<Login />
			</section>
		</Card>
	    ) : (
		  <Dashboard user={user} />
	  )}
	 </Container>
    );
};

export default ToDoApp;