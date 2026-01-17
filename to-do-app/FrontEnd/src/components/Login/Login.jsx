//****************************************************************************************
// Filename: Login.jsx
// Date: 14 January 2026
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
	    <Paper elevation={0} className="login">
			<form className="login-form" onSubmit={handleSubmit(onSubmit)}>
			 <header className="login-header">
				<Typography variant="h6" fontWeight={600}>
					Welcome back
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Sign in to continue
				</Typography>
			 </header>
				
			<Box className="login-fields">
				<TextField
					label="Email"
					type="email"
					size="small"
					autoComplete="email"
					fullWidth
					{...register("email", { required: true })}
				/>
				<TextField
					label="Password"
					type="password"
					size="small"
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
			
			<Button type="submit" variant="outlined" size="large" fullWidth className="login-button">
				Sign in
			</Button>
		  </form>
	    </Paper>
	</Fade>
    );
};

export default Login;