//****************************************************************************************
// Filename: CreateTaskList.jsx
// Date: 30 January 2026
// Author: Kyle McColgan
// Description: This file contains the CreateTaskList React component for ShowMeTasks.
//****************************************************************************************

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./CreateTaskList.css"; // Import the CSS file

const CreateTaskList = ({ onCreateNamed, onCreateToday }) => {
	const { user, accessToken } = useContext(AuthContext);
    const [name, setName] = useState("");
	
	const canCreate = Boolean( (user) && (accessToken) );
	const hasText = Boolean(name.trim());

    const submitNamed = () => {
		if ( ( ! canCreate) || ( ! hasText) )
		{
            return;
        }
		
		onCreateNamed(name.trim());
		setName("");
    };
	
	const submitToday = () => {
		if ( ! canCreate )
		{
            return;
        }
		
		onCreateToday();
    };

    return (
		<section
		  className="create-tasklist"
		  role="group"
		  aria-label="Create new task list"
		>
			<input
			    type="text"
			    className="create-tasklist-input"
				placeholder="New list…"
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if ( (e.key === "Enter") && (hasText) ) submitNamed();
					if (e.key === "Escape") setName("");
				}}
				aria-label="New task list name"
			/>
			
			<button
			  className={`create-tasklist-action ${hasText ? "primary" : "ghost"}`}
			  onClick={hasText ? submitNamed : submitToday}
			  disabled={ ! canCreate}
			  aria-label={hasText ? "Add list" : "Create today's list"}
			>
			  {hasText ? "Add" : "Today"}
			</button>
		</section>
    );
};

export default CreateTaskList;