//****************************************************************************************
// Filename: CreateTaskList.jsx
// Date: 26 January 2026
// Author: Kyle McColgan
// Description: This file contains the CreateTaskList React component for ShowMeTasks.
//****************************************************************************************

import { useState, useContext } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/AuthContext";
import "./CreateTaskList.css"; // Import the CSS file

const CreateTaskList = ({ onCreateNamed, onCreateToday }) => {
	const { user, accessToken } = useContext(AuthContext);
    const [name, setName] = useState("");
	const canQuickAdd = Boolean( (user) && (accessToken) );
	const canNamedAdd = Boolean( (canQuickAdd) && (name.trim()) );

    const submitNamed = () => {
		if ( ! canNamedAdd )
		{
            return;
        }
		
		onCreateNamed(name.trim());
		setName("");
    };
	
	const submitToday = () => {
		if ( ! canQuickAdd )
		{
            return;
        }
		
		onCreateToday();
    };
	
	const hasText = Boolean(name.trim());

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
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if ( (e.key === "Enter") && (hasText) ) submitNamed();
					if (e.key === "Escape") setName("");
				}}
			/>
			
			{hasText ? (
				<Button
				  variant="contained"
				  size="small"
				  onClick={submitNamed}
				  disabled={ ! canNamedAdd}
				>
					Add
				</Button>
			) : (
			  <IconButton
			    size="small"
				onClick={submitToday}
				disabled={ ! canQuickAdd}
				aria-label="Create List of the Day"
			  >
			    <AddIcon />
			  </IconButton>
			)}
		</section>
    );
};

export default CreateTaskList;