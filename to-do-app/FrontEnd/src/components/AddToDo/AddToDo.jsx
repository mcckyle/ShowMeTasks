//****************************************************************************************
// Filename: AddToDo.jsx
// Date: 02 November 2025
// Author: Kyle McColgan
// Description: This file contains the React AddToDo component for ShowMeTasks.
//****************************************************************************************

import React, { useState } from "react";
import { TextField, Button, Paper, Box } from "@mui/material";
import "./AddToDo.css"; // Import the CSS file

const AddToDo = ({ taskListId, onAdd }) => {
    const [text, setText] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!taskListId)
		{
			console.error("Task list ID is missing or invalid.");
			return; // Avoid sending the request if taskListId is invalid.
		}

		const apiUrl = `http://localhost:8080/api/todos/create?taskListId=${taskListId}&description=${text}`;

		try
		{
			const token = localStorage.getItem('authToken');

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Include token in the Authorization header
				},
			});

			const rawResponse = await response.text(); // Get raw text response
			console.log("Raw Response:", rawResponse);

			if (!response.ok)
			{
				throw new Error("Network response was not OK.");
			}

			const newTask = JSON.parse(rawResponse); // Parse the response as JSON
			console.log("Task added: ", newTask);

			onAdd(newTask); // Call the onAdd function to update the state in ToDoApp
			setText(""); // Clear the input field
		}
		catch (error)
		{
			console.error("Error adding todo:", error);
		}
	};

    return (
	  <Paper
	    elevation={3}
		className="add-todo-container"
		component="form"
		onSubmit={handleSubmit}
	  >
	    <Box className="add-todo-input-wrapper">
            <TextField
			    label="Add a new task..."
				variant="outlined"
				value={text}
				onChange={(e) => setText(e.target.value)}
                fullWidth
                size="medium"
            />
		</Box>
            <Button
			  type="submit"
			  variant="contained"
			  className="add-todo-button"
			  disabled={!text.trim()}
			>
                Add Task
            </Button>
        </Paper>
    );

};

export default AddToDo;