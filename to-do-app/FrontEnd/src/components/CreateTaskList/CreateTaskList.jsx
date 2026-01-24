//****************************************************************************************
// Filename: CreateTaskList.jsx
// Date: 23 January 2026
// Author: Kyle McColgan
// Description: This file contains the CreateTaskList React component for ShowMeTasks.
//****************************************************************************************

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createList } from "../../services/ListService";
import { TextField, Button } from "@mui/material";
import "./CreateTaskList.css"; // Import the CSS file

const CreateTaskList = ({ onTaskListCreated }) => {
	const { user, accessToken } = useContext(AuthContext);
    const [name, setName] = useState("");
	const canSubmit = Boolean(user && accessToken && name.trim());

    const submit = async () => {
		if ( ! canSubmit )
		{
            return;
        }

        try
		{
            const newList = await createList(
			    { name: name.trim() },
				accessToken
            );
			
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
		<section
		  className="create-tasklist"
		  role="group"
		  aria-label="Create new task list"
		>
			<TextField
			    className="create-tasklist-input"
			    placeholder="New list…"
				size="small"
				fullWidth
				autoFocus
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") submit();
					if (e.key === "Escape") setName("");
				}}
			/>
			
			<Button
			  variant="contained"
			  size="small"
			  disabled={ ! canSubmit}
			  onClick={submit}
			>
				Add
			</Button>
		</section>
    );
};

export default CreateTaskList;