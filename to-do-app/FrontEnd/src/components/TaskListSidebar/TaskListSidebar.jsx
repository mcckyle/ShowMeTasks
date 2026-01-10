//****************************************************************************************
// Filename: TaskListSidebar.jsx
// Date: 6 January 2026
// Author: Kyle McColgan
// Description: This file contains the TaskListSidebar React component for ShowMeTasks.
//****************************************************************************************

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button, Typography, Dialog, DialogContent, DialogActions, TextField } from "@mui/material";

import "./TaskListSidebar.css";

const TaskListSidebar = ({ taskLists, onSelect, selectedList, onListCreated }) => {
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
			const result = await fetch("http://localhost:8080/api/todos/list/create", {
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
			setNewListName("");
			setOpen(false);
		}
		catch (error)
		{
			console.error("Error creating list:", error);
		}
	};
	
	return (
	  <nav className="tasklist-sidebar">
	    {/* Header. */}
		<header className="sidebar-header">
		  <Typography className="sidebar-title">Lists</Typography>
		  <Button
		    size="small"
		    variant="contained"
			className="new-list-btn"
		    onClick={() => setOpen(true)}
		  >
		    New
		  </Button>
		</header>
		
		{/* Lists. */}
		<div className="lists">
		  {taskLists.length === 0 ? (
		    <Typography className="empty-state">
			  Start by creating a task list
			</Typography>
		  ) : (
		    taskLists.map((list) => {
			  const isActive = selectedList?.id === list.id;
			  
			  return (
			    <button
			      key={list.id}
				  className={`list-item ${isActive ? "active" : ""}`}
				  onClick={() => onSelect(list)}
			    >
			      <span className="list-name">{list.name}</span>
				  <span className="list-count">
				    {list.tasks?.length || 0}
				  </span>
			  </button>
			);
		  })
		)}
	  </div>
		
		{/* Create Dialog. */}		
		<Dialog open={open} onClose={() => setOpen(false)}>
		  <DialogContent>
		    <TextField
			  autoFocus
			  label="Task List Name"
			  value={newListName}
			  onChange={(e) => setNewListName(e.target.value)}
			  fullWidth
			/>
		  </DialogContent>
		  <DialogActions>
		    <Button onClick={() => setOpen(false)}>Cancel</Button>
			<Button variant="contained" onClick={handleCreateList} disabled={ ! newListName.trim()}>Create</Button>
		  </DialogActions>
		</Dialog>
	  </nav>
	);
};

export default TaskListSidebar;