//****************************************************************************************
// Filename: TaskListView.jsx
// Date: 14 January 2026
// Author: Kyle McColgan
// Description: This file contains the TaskListView React component for ShowMeTasks.
//****************************************************************************************

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Card, Typography, Button, TextField, Tooltip } from "@mui/material";

const TaskListView = ({ selectedList }) => {
	const { accessToken } = useContext(AuthContext);
	const [todos, setTodos] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [editingText, setEditingText] = useState("");
	const [editingListName, setEditingListName] = useState(false);
	const [listName, setListName] = useState(selectedList?.name || "");
	
	/* Sync list name on selection changes. */
	useEffect(() => {
		setListName(selectedList?.name || "");
		setEditingListName(false);
	}, [selectedList]);
	
	/* Fetch Tasks. */
	useEffect(() => {
		if ( ! selectedList)
		{
			return;
		}
		
		const fetchTodos = async () => {
			try
			{
				const result = await fetch(`http://localhost:8080/api/todos/${selectedList.id}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				
				if (result.ok)
				{
					const data = await result.json();
					setTodos(data);
				}
			}
			catch (error)
			{
				console.error("Error fetching tasks:", error);
			}
		};
		fetchTodos();
	}, [selectedList, accessToken]);
	
	const handleUpdateListName = async () => {
		if ( ! listName.trim())
		{
			return;
		}
		
		try
		{
			const result = await fetch(`http://localhost:8080/api/todos/list/${selectedList.id}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: listName }),
			});
			
			if (result.ok)
			{
				setEditingListName(false);
			}
		}
		catch (error)
		{
			console.error("Failed to update list name: ", error);
		}
	};
	
	const handleUpdateTask = async (taskId) => {
		if ( ! editingText.trim())
		{
			return;
		}
		
		try
		{
			const result = await fetch(`http://localhost:8080/api/todos/${taskId}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ description: editingText }),
			});
			
			if (result.ok)
			{
				const updated = await result.json();
				setTodos((prev) =>
				  prev.map((t) => (t.id === taskId ? updated : t))
				);
				setEditingId(null);
			}
		}
		catch (error)
		{
			console.error("Error updating task: ", error);
		}
	};
	
	const handleDeleteList = async () => {
		const confirmed = window.confirm(
		  "Delete this task list and all its tasks?"
		);
		
		if ( ! confirmed)
		{
			return;
		}
		
		try
		{
			await fetch(`http://localhost:8080/api/todos/list/${selectedList.id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			
			window.location.reload(); //Or lift state here...
		}
		catch (error)
		{
			console.error("Failed to delete the list: ", error);
		}
	};
	
	const handleDelete = async (id) => {
		try
		{
			await fetch(`http://localhost:8080/api/todos/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			setTodos((prev) => prev.filter((t) => t.id !== id));
		}
		catch (error)
		{
			console.error("Error deleting task: ", error);
		}
	};
	
	if ( ! selectedList)
	{
		return (
		  <div className="tasklist-placeholder">
		    Select a list to begin.
		  </div>
		);
	}
	
	return (
	  <Card className="tasklist-view" elevation={0}>
	    {/* Header. */}
		<header className="tasklist-header">
		 <div className="tasklist-header-main">
		 {editingListName ? (
		   <TextField
		     value={listName}
			 onChange={(e) => setListName(e.target.value)}
			 onBlur={handleUpdateListName}
			 onKeyDown={(e) => {
				 if (e.key === "Enter") handleUpdateListName();
				 if (e.key === "Escape") {
					 setListName(selectedList.name);
					 setEditingListName(false);
				 }
			 }}
			 size="small"
			 autoFocus
			 fullWidth
			/>
		  ) : (
		  <Typography
		    className="tasklist-title"
			onDoubleClick={() => setEditingListName(true)}
		  >
		    {listName}
			{selectedList.isDefault && (
			  <span style={{opacity: 0.6, fontSize: "0.7rem", marginLeft: 8}}>
			    (default)
			  </span>
			)}
		  </Typography>
		 )}
		 
		 <Typography className="tasklist-count">
		    {todos.length} {todos.length === 1 ? "task" : "tasks"}
		  </Typography>
		</div>
		
		<Tooltip
		  title={selectedList.isDefault
		    ? "The default task list cannot be deleted."
			: "Delete this task list"
		  }
		  arrow
		>
		 <span>
		  <Button
		    size="small"
			color="error"
			className="delete-list-btn"
			onClick={handleDeleteList}
			disabled={selectedList.isDefault}
		  >
		    Delete
		  </Button>
		 </span>
		</Tooltip>
		</header>
		
		{/* Tasks. */}
		<section className="tasklist-content">
		  {todos.length === 0 ? (
		    <Typography className="tasklist-empty">
			  Add your first task to get started.
			</Typography>
		  ) : (
		   todos.map((task) => (
			 <div key={task.id} className="task-row">
				{editingId === task.id ? (
				   <TextField
				     value={editingText}
					 onChange={(e) => setEditingText(e.target.value)}
					 onBlur={() => setEditingId(null)}
					 onKeyDown={(e) => {
						 if (e.key === "Enter") handleUpdateTask(task.id);
						 if (e.key === "Escape") setEditingId(null);
					 }}
					 size="small"
					 autoFocus
					 fullWidth
				   />
				) : (
			        <span
			          className="task-text"
				      onDoubleClick={() => {
					     setEditingId(task.id);
					     setEditingText(task.description);
				      }}
			        >
			            {task.description}
			        </span>
		        )}
				
				<div className="task-actions">
				  {editingId === task.id ? (
				    <Button size="small" onClick={() => handleUpdateTask(task.id)}>
			          Save
			        </Button>
			      ) : (
				   <Button
					 size="small"
					 color="error"
					 onClick={() => handleDelete(task.id)}
				   >
					 Delete
				   </Button>
			     )}
			  </div>
			</div>
			))
		  )}
		</section>
	</Card>
	);
};

export default TaskListView;