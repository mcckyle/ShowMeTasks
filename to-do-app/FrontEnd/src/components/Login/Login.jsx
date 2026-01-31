//****************************************************************************************
// Filename: Login.jsx
// Date: 29 January 2026
// Author: Kyle McColgan
// Description: This file contains the React Login component for ShowMeTasks.
//****************************************************************************************

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css"; // Import the custom CSS file.

const Login = () => {
	const navigate = useNavigate();
	const { login } = useContext(AuthContext);
	const { register, handleSubmit } = useForm();
	const [errorMessage, setErrorMessage] = useState("");

    async function onSubmit(data) {
		setErrorMessage("");
		
		try
		{
			await login(data);
			navigate("/tasks");
		}
		catch
		{
			setErrorMessage("Invalid email or password!");
		}
	};

    return (
	  <div className="login">
		<form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
		 <header className="login-header">
			<h1>Welcome back</h1>
			<p className="login-subtitle">
			  Sign in to access your tasks
			</p>
		 </header>
			
		<div className="login-fields">
			<label className="login-field">
			  <span>Email</span>
			  <input
				type="email"
				autoComplete="email"
				{...register("email", { required: true })}
			  />
			</label>
			<label className="login-field">
			  <span>Password</span>
			  <input
				type="password"
				autoComplete="current-password"
				{...register("password", { required: true })}
			  />
			</label>
		</div>
		
		{errorMessage && (
			<p className="login-error" role="alert">
			  {errorMessage}
			</p>
		  )}
		
		<button type="submit" className="login-button">
			Sign in
		</button>
	  </form>
	</div>
    );
};

export default Login;