//****************************************************************************************
// Filename: Register.jsx
// Date: 2 January 2026
// Author: Kyle McColgan
// Description: This file contains the React Registration component for ShowMeTasks.
//****************************************************************************************

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/AuthService";
import { AuthContext } from "../../context/AuthContext";
import { TextField, Button, Typography, Paper, Box, Fade } from "@mui/material";
import "./Register.css"; // Import the custom CSS file

const Register = ({ onRegister }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
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
			
			navigate("/dashboard");
        }
        catch
        {
            setErrorMessage("Unable to create account. Please try again.");
        }
    };

     return (
	 <Fade in timeout={700}>
	   <Paper elevation={6} className="register-container">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h5" className="register-title">
                Create Your Account ✨
            </Typography>
			
			<Box className="register-fields">
                    <TextField
					    label="Username"
                        variant="outlined"
                        fullWidth
                        {...register("username", { required: true })}  
                    />
                    <TextField
					    label="Email"
						type="email"
                        variant="outlined"
                        fullWidth
                        {...register("email", { required: true })}      
                    />
                    <TextField
					    label="Password"
                        type="password"
						variant="outlined"
                        fullWidth
                        {...register("password", { required: true })}
                    />
					<TextField
					    label="Confirm Password"
                        type="password"
						variant="outlined"
                        fullWidth
                        {...register("confirmPassword", { required: true })}
                    />
				  </Box>
				<Button type="submit" variant="contained" fullWidth className="register-button">
					Create account
				</Button>
            </form>
		</Paper>
	</Fade>
    );
};

export default Register;