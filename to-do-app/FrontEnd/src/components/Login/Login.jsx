//****************************************************************************************
// Filename: Login.jsx
// Date: 6 January 2026
// Author: Kyle McColgan
// Description: This file contains the React Login component for ShowMeTasks.
//****************************************************************************************

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Paper, Box, Fade  } from "@mui/material";
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
	  <Fade in timeout={400}>
	    <Paper elevation={6} className="login">
			<form className="login-form" onSubmit={handleSubmit(onSubmit)}>
			 <header className="login-header">
				<Typography className="login-title">
					Welcome Back
				</Typography>
				<Typography className="login-subtitle">
					Sign in to continue
				</Typography>
			 </header>
				
			<Box className="login-fields">
				<TextField
					label="Email"
					fullWidth
					autoComplete="email"
					fullWidth
					{...register("email", { required: true })}
				/>
				<TextField
					label="Password"
					type="password"
					autoComplete="current-password"
					fullWidth
					{...register("password", { required: true })}
				/>
			</Box>
			
			{errorMessage && (
				<Typography className="login-error">
				  {errorMessage}
				</Typography>
			  )}
			
			<Button
			  type="submit"
			  variant="contained"
			  fullWidth
			>
				Sign in
			</Button>
		  </form>
	    </Paper>
	</Fade>
    );
};

export default Login;