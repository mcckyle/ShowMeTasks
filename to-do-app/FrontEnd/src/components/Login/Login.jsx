//****************************************************************************************
// Filename: Login.jsx
// Date: 2 January 2026
// Author: Kyle McColgan
// Description: This file contains the React Login component for ShowMeTasks.
//****************************************************************************************

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Typography, Paper, Box, Fade  } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css"; // Import the custom CSS file

const Login = ({ onLogin }) => {
	const navigate = useNavigate();
	const { login } = useContext(AuthContext);
	const { register, handleSubmit, formState: { errors } } = useForm();
	const [errorMessage, setErrorMessage] = useState("");

    async function onSubmit(data) {
		setErrorMessage("");
		
		try
		{
			await login(data);
			navigate("/dashboard");
		}
		catch (error)
		{
			setErrorMessage("Invalid email or password!");
		}
	};

    return (
	  <Fade in timeout={700}>
	    <Paper elevation={6} className="login-container">
			<form className="login-form" onSubmit={handleSubmit(onSubmit)}>
				<Typography variant="h5" className="login-title">
					Welcome Back! 👋
				</Typography>
				
				<Box className="login-fields">
					<TextField
						label="Email"
						variant="outlined"
						fullWidth
						{...register("email", { required: true })}
					/>
					<TextField
						label="Password"
						variant="outlined"
						type="password"
						fullWidth
						{...register("password", { required: true })}
					/>
				</Box>
				
				<Button type="submit" variant="contained" fullWidth className="login-button">
					Login
				</Button>
			</form>
	    </Paper>
	</Fade>
    );
};

export default Login;