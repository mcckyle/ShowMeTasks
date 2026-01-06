//****************************************************************************************
// Filename: Login.jsx
// Date: 4 January 2026
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
			navigate("/dashboard");
		}
		catch
		{
			setErrorMessage("Invalid email or password!");
		}
	};

    return (
	  <Fade in timeout={700}>
	    <Paper elevation={6} className="auth-container">
			<form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
			  <Box className="auth-header">
				<Typography variant="h5" className="auth-title">
					Welcome Back
				</Typography>
				<Typography variant="body2" className="auth-subtitle">
					Sign in to continue
				</Typography>
			  </Box>
				
				<Box className="auth-fields">
					<TextField
						label="Email"
						fullWidth
						autoComplete="email"
						{...register("email", { required: true })}
					/>
					<TextField
						label="Password"
						type="password"
						fullWidth
						autoComplete="current-password"
						{...register("password", { required: true })}
					/>
				</Box>
				
				{errorMessage && (
				    <Typography className="auth-error">
					  {errorMessage}
					</Typography>
				  )}
				
				<Button
				  type="submit"
				  variant="contained"
				  size="large"
				  fullWidth
				  className="auth-button"
				>
					Login
				</Button>
			</form>
	    </Paper>
	</Fade>
    );
};

export default Login;