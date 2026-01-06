//****************************************************************************************
// Filename: TaskListView.jsx
// Date: 4 January 2026
// Author: Kyle McColgan
// Description: This file contains the TaskListView React component for ShowMeTasks.
//****************************************************************************************

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Card, Typography, Button, TextField } from "@mui/material";

const TaskListView = ({ selectedList }) => {
	const { accessToken } = useContext(AuthContext);
	const [todos, setTodos] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editingText, setEditingText] = useState("");
	const [editingListName, setEditingListName] = useState(false);
	const [listName, setListName] = useState(selectedList?.name || "");
	
	//Sync when selection changes.
	useEffect(() => {
		setListName(selectedList?.name || "");
		setEditingListName(false);
	}, [selectedList]);
	
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
	
	const handleAddTask = async () => {
		if ( ! newTask.trim())
		{
			return;
		}
		
		try
		{
			const result = await fetch("http://localhost:8080/api/todos/create", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ taskListId: selectedList.id, description: newTask }),
			});
			
			if (result.ok)
			{
				const created = await result.json();
				setTodos((prev) => [...prev, created]);
				setNewTask("");
			}
		}
		catch (error)
		{
			console.error("Error adding task: ", error);
		}
	};
	
	const handleUpdateListName = async () => {
		if ( ! listName.trim())
		{
			return;
		}
		
		try
		{
			const result = await fetch(`http://localhost:8080/api/todos/list/update/${selectedList.id}`, {
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
	
	if ( ! selectedList)
	{
		return (
		  <Typography className="tasklist-placeholder">
		    Select a list to view tasks.
		  </Typography>
		);
	}
	
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
		  <Typography className="tasklist-placeholder">
		    Select a list to view tasks.
		  </Typography>
		);
	}
	
	return (
	  <Card className="tasklist-view">
	    {/* Header. */}
		<div className="tasklist-header">
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
		  </Typography>
		 )}
		 
		 <div>
		  <Typography className="tasklist-count">
		    {todos.length} tasks
		  </Typography>
		  
		  <Button
		    size="small"
			color="error"
			onClick={handleDeleteList}
		  >
		    Delete List
		  </Button>
		</div>
	  </div>
		
		{/* Tasks. */}
		<div className="tasklist-content">
		  {todos.length === 0 ? (
		    <Typography className="tasklist-empty">
			  Add your first task below.
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
				<Button
			     size="small"
			     onClick={() => handleUpdateTask(task.id)}
			   >
			     Update
			   </Button>
			   {editingId !== task.id && (
				   <Button
					 size="small"
					 color="error"
					 onClick={() => handleDelete(task.id)}
				   >
					 Delete
				   </Button>
			   )}
			 </div>
			))
		  )}
		</div>
		
		{/* Input. */}
		<div className="tasklist-input">
		  <TextField
			value={newTask}
			onChange={(e) => setNewTask(e.target.value)}
			label="New Task"
			size="small"
			fullWidth
		  />
		  <Button
		    variant="contained"
		    onClick={handleAddTask}
		    disabled={ ! newTask.trim()}
		  >
		    Add
		  </Button>
		</div>
	</Card>
	);
};

export default TaskListView;