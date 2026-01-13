//****************************************************************************************
// Filename: Register.jsx
// Date: 11 January 2026
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
	 <Fade in timeout={400}>
	   <Paper elevation={1} className="register">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
		  <header className="register-header">
            <Typography variant="h6" fontWeight={600}>
                Create an account
            </Typography>
			<Typography variant="body2" color="text.secondary">
                Get started with ShowMeTasks
            </Typography>
		  </header>
			
			<Box className="register-fields">
                    <TextField
					    label="Username"
                        fullWidth
						size="small"
                        {...register("username", { required: true })}  
                    />
                    <TextField
					    label="Email"
						type="email"
                        fullWidth
						size="small"
                        {...register("email", { required: true })}      
                    />
                    <TextField
					    label="Password"
                        type="password"
                        fullWidth
						size="small"
                        {...register("password", { required: true })}
                    />
					<TextField
					    label="Confirm Password"
                        type="password"
                        fullWidth
						size="small"
                        {...register("confirmPassword", { required: true })}
                    />
				  </Box>
				  
				  {errorMessage && (
				    <Typography className="register-error">
					  {errorMessage}
					</Typography>
				  )}
				  
				  <Button type="submit" variant="contained" size="large" fullWidth>
				    Create account
				  </Button>
              </form>
		  </Paper>
	  </Fade>
    );
};

export default Register;