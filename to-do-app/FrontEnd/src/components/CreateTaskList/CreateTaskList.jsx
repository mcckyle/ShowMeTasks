//****************************************************************************************
// Filename: CreateTaskList.jsx
// Date: 19 January 2026
// Author: Kyle McColgan
// Description: This file contains the CreateTaskList React component for ShowMeTasks.
//****************************************************************************************

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TextField, Button } from "@mui/material";
import "./CreateTaskList.css"; // Import the CSS file

const CreateTaskList = ({ onTaskListCreated }) => {
	const { user, accessToken } = useContext(AuthContext);
    const [name, setName] = useState("");
	const canSubmit = user && accessToken && name.trim();

    const submit = async () => {
		if ( ! canSubmit )
		{
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/todos/list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ username: user.username, name: name.trim() }),
            });

            if ( ! response.ok)
			{
                throw new Error();
            }

            const newList = await response.json();
            //console.log("Task list created: ", newList);
            setName(""); // Clear the input field.
			onTaskListCreated?.(newList);
        }
		catch (error)
		{
            console.error("Error creating task list:", error);
        }
    };

    return (
		<div
		  className="create-tasklist"
		  role="group"
		  aria-label="Create new task list"
		>
			<TextField
			    placeholder="Create new list…"
				size="small"
				fullWidth
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") submit();
					if (e.key === "Escape") setName("");
				}}
			/>
			
			<Button
			  size="small"
			  variant="contained"
			  disabled={ ! canSubmit}
			  onClick={submit}
			>
				Add
			</Button>
		</div>
    );
};

export default CreateTaskList;