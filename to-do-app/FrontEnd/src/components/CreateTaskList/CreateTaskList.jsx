//****************************************************************************************
// Filename: CreateTaskList.jsx
// Date: 11 January 2026
// Author: Kyle McColgan
// Description: This file contains the CreateTaskList React component for ShowMeTasks.
//****************************************************************************************

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TextField, Button } from "@mui/material";
import "./CreateTaskList.css"; // Import the CSS file

const CreateTaskList = ({ onTaskListCreated }) => {
	const { user, accessToken } = useContext(AuthContext);
    const [taskListName, setTaskListName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
		
		if ( ( ! user) || ( ! accessToken) || ( ! taskListName.trim() ) )
		{
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/todos/list/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ username: user.username, name: taskListName.trim() }),
            });

            if ( ! response.ok)
			{
                throw new Error("Failed to create the list!");
            }

            const newTaskList = await response.json();
            //console.log("Task list created: ", newTaskList);
            setTaskListName(""); // Clear the input field.
			onTaskListCreated?.(newTaskList);
        }
		catch (error)
		{
            console.error("Error creating task list:", error);
        }
    };

    return (
		<form
		  className="create-tasklist"
		  aria-label="Create task list"
		  onSubmit={handleSubmit}
		>
			<TextField
			    placeholder="New list name..."
				size="small"
				fullWidth
				value={taskListName}
				onChange={(e) => setTaskListName(e.target.value)}
				onKeyDown={(e) => e.key === "Escape" && setTaskListName("")}
			/>
			<Button
			  type="submit"
			  variant="contained"
			  size="small"
			  disabled={!taskListName.trim()}
			>
				Create
			</Button>
		</form>
    );
};

export default CreateTaskList;