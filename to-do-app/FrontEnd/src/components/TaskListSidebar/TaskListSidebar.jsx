//****************************************************************************************
// Filename: TaskListSidebar.jsx
// Date: 2 January 2026
// Author: Kyle McColgan
// Description: This file contains the TaskListSidebar React component for ShowMeTasks.
//****************************************************************************************

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button, Card, Typography, Dialog, DialogContent, DialogActions, TextField } from "@mui/material";

const TaskListSidebar = ({ user, taskLists, onSelect, selectedList, onListCreated }) => {
	const { accessToken } = useContext(AuthContext);
	const [open, setOpen] = useState(false);
	const [newListName, setNewListName] = useState("");
	
	const handleCreateList = async () => {
		if ( ! newListName.trim())
		{
			return;
		}
		
		try
		{
			const result = await fetch('http://localhost:8080/api/todos/list/create', {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: newListName }),
			});
			
			if ( ! result.ok)
			{
				throw new Error(`Failed to create list: ${result.status}`);
			}
			
			const data = await result.json();
			onListCreated(data);
			setOpen(false);
			setNewListName("");
		}
		catch (error)
		{
			console.error("Error creating list:", error);
		}
	};
	
	return (
	  <div className="sidebar">
	    <Button variant="contained" onClick={() => setOpen(true)}>+ New List</Button>
		<Dialog open={open} onClose={() => setOpen(false)}>
		  <DialogContent>
		    <TextField
			  value={newListName}
			  onChange={(e) => setNewListName(e.target.value)}
			  label="Task List Name"
			  fullWidth
			/>
		  </DialogContent>
		  <DialogActions>
		    <Button onClick={() => setOpen(false)}>Cancel</Button>
			<Button onClick={handleCreateList}>Create</Button>
		  </DialogActions>
		</Dialog>
		
		<div className="lists">
		{taskLists.map((list) => (
		  <Card
		    key={list.id}
			className={`list-card ${selectedList?.id === list.id ? 'active' : ''}`}
			onClick={() => onSelect(list)}
		  >
		    <Typography variant="body1">{list.name}</Typography>
			<Typography variant="caption">{list.tasks?.length || 0} tasks</Typography>
		  </Card>
		))}
	  </div>
	</div>
	);
};

export default TaskListSidebar;