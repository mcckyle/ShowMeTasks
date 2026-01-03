//****************************************************************************************
// Filename: CreateTaskList.jsx
// Date: 02 November 2025
// Author: Kyle McColgan
// Description: This file contains the CreateTaskList React component for ShowMeTasks.
//****************************************************************************************

import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box, Fade } from "@mui/material";
import "./CreateTaskList.css"; // Import the CSS file

const CreateTaskList = ({ user, onTaskListCreated }) => {
    const [taskListName, setTaskListName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
		
		if (!user || !user.token)
		{
            console.error("User or token is missing...");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/todos/list/create", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ username: user.username, name: taskListName }),
            });

            if (!response.ok)
			{
                throw new Error('Network response was not okay...');
            }

            const newTaskList = await response.json();
            console.log('Task list created:', newTaskList);
            setTaskListName(""); // Clear the input field

            // Pass the new task list to parent component to update the task lists
            onTaskListCreated(newTaskList);

        }
		catch (error)
		{
            console.error('Error creating task list:', error);
        }
    };

    return (
	  <Fade in timeout={600}>
	    <Paper elevation-{6} className="create-tasklist-container">
			<form className="create-tasklist-form" onSubmit={handleSubmit}>
			  <Typography variant="h6" className="create-tasklist-title">
			    Create a New Task List
			  </Typography>
			  
			  <Box className="create-tasklist-fields">
				<TextField
					label="Task List Name"
					value={taskListName}
					onChange={(e) => setTaskListName(e.target.value)}
					variant="outlined"
					fullWidth
					required
				/>
			  </Box>
				<Button type="submit" variant="contained" fullWidth className="create-tasklist-button">
					Create Task List
				</Button>
			</form>
		</Paper>
	</Fade>
    );
};

export default CreateTaskList;