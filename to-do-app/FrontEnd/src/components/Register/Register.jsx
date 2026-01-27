//****************************************************************************************
// Filename: Register.jsx
// Date: 26 January 2026
// Author: Kyle McColgan
// Description: This file contains the React Registration component for ShowMeTasks.
//****************************************************************************************

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/AuthService";
import { AuthContext } from "../../context/AuthContext";
import { TextField, Button, Typography, Paper, Box, Fade } from "@mui/material";
import "./Register.css"; // Import the custom CSS file

const Register = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useContext(AuthContext);
	const [errorMessage, setErrorMessage] = useState("");

	async function onSubmit(data) {
		setErrorMessage("");
		
		//Password Match Check.
		if (data.password !== data.confirmPassword)
		{
			setErrorMessage("Passwords do not match!");
			return;
		}
		
		//Remove confirmPassword before sending the payload...
		const { confirmPassword, ...payload } = data;
        
        try
        {
			const response = await registerUser(payload);
			
			setAccessToken(response.accessToken);
			setUser({ username: response.username, email: response.email });
			
			navigate("/tasks");
        }
        catch
        {
            setErrorMessage("Unable to create account. Please try again.");
        }
    };

    return (
	 <Fade in timeout={280}>
	   <Paper elevation={0} className="register">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
		  <header className="register-header">
            <Typography variant="h5" fontWeight={700}>
                Create your account
            </Typography>
			<Typography variant="body2" color="text.secondary" className="register-subtitle">
                Get started in seconds
            </Typography>
		  </header>
			
		  <Box className="register-fields">
			<TextField
			  label="Username"
			  size="small"
			  fullWidth
			  {...register("username", { required: true })}  
			/>
			<TextField
			  label="Email"
			  type="email"
			  size="small"
			  fullWidth
			  {...register("email", { required: true })}      
			/>
			<TextField
			  label="Password"
			  type="password"
			  size="small"
			  fullWidth
			  {...register("password", { required: true })}
			/>
			<TextField
			  label="Confirm Password"
			  type="password"
			  size="small"
			  fullWidth
			  {...register("confirmPassword", { required: true })}
			/>
		  </Box>
				  
		  {errorMessage && (
			<Typography className="register-error" role="alert">
			  {errorMessage}
			</Typography>
		  )}
		  
		  <Button
		    type="submit"
			variant="contained"
			size="large"
			fullWidth
			className="register-button"
		  >
			Create account
		  </Button>
         </form>
		</Paper>
	  </Fade>
    );
};

export default Register;