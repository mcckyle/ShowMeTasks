//****************************************************************************************
// Filename: TaskListView.jsx
// Date: 23 January 2026
// Author: Kyle McColgan
// Description: This file contains the TaskListView React component for ShowMeTasks.
//****************************************************************************************

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateList, deleteList } from "../../services/ListService";
import { getTasks, createTask, updateTask, deleteTask } from "../../services/TaskService";
import { Card, Typography, Button, TextField, Tooltip, Checkbox } from "@mui/material";

import "./TaskListView.css";

const TaskListView = ({ selectedList }) => {
	const { accessToken } = useContext(AuthContext);
	const [tasks, setTasks] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [editingText, setEditingText] = useState("");
	const [editingListName, setEditingListName] = useState(false);
	const [listName, setListName] = useState(selectedList?.name || "");
	const [loading, setLoading] = useState(true);
	
	/* Sync list name on selection changes. */
	useEffect(() => {
		setListName(selectedList?.name || "");
		setEditingListName(false);
	}, [selectedList]);
	
	/* Fetch tasks here, not lists. */
	useEffect(() => {
		if ( ( ! selectedList) || ( ! accessToken) )
		{
			return;
		}
		let isMounted = true;
		
		const loadTasks = async () => {
			try
			{
				setLoading(true);
				const data = await getTasks(selectedList.id, accessToken);
				
				if (isMounted)
				{
					setTasks(data ?? []);
				}
			}
			catch (error)
			{
				console.error("Failed to load tasks:", error);
			}
			finally
			{
				if (isMounted)
				{
					setLoading(false);
				}
			}
		}
		
		loadTasks();
		
		return () => {
			isMounted = false;
		};
	}, [selectedList, accessToken]);
	
	const handleUpdateListName = async () => {
		if ( ! listName.trim())
		{
			return;
		}
		
		try
		{
			await updateList(
			    selectedList.id,
				{ name: listName.trim() },
				accessToken
			);
			
			setEditingListName(false);
		}
		catch (error)
		{
			console.error("Failed to update list name: ", error);
		}
	};
	
	const handleUpdateTask = async (taskId) => {
		const newText = editingText.trim();
		if ( ! newText)
		{
			return;
		}
		
		try
		{
			await updateTask(
			    taskId,
				{ description: newText },
				accessToken
			);
			
			setTasks((prev) =>
				  prev.map((t) => (t.id === taskId ? { ...t, description: newText } : t))
			);
			
			setEditingId(null);
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
			await deleteList(selectedList.id, accessToken);
			window.location.reload();
		}
		catch (error)
		{
			console.error("Failed to delete the list: ", error);
		}
	};
	
	const handleDeleteTask = async (id) => {
		try
		{
			await deleteTask(id, accessToken);
			setTasks((prev) => prev.filter((t) => t.id !== id));
		}
		catch (error)
		{
			console.error("Error deleting task: ", error);
		}
	};
	
	const handleToggleCompleted = async (task) => {
		const nextCompleted = ! task.completed;
		
		//Optimistic UI.
		setTasks((prev) =>
		    prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
		);
		
		try
		{
			await updateTask(
			    task.id,
				{
				  completed: nextCompleted,
				  description: task.description, //Preserve task description...
				},
				accessToken
			);
		}
		catch (error)
		{
			//Roll back if needed...
			setTasks((prev) =>
		        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
			);
			console.error("Failed to toggle task: ", error);
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
			title="Double-click to rename"
		  >
		    {listName}
			{selectedList.isDefault && (
			  <span className="tasklist-default">(default)</span>
			)}
		  </Typography>
		 )}
		 
		 <Typography className="tasklist-count">
		    {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
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
		  {loading ? (
		    <Typography className="tasklist-empty">
			  Loading tasks…
			</Typography>
		  ) : tasks.length === 0 ? (
		    <Typography className="tasklist-empty">
			  Add your first task to get started.
			</Typography>
		  ) : (
		   tasks.map((task) => (
		  <div key={task.id} className={`task-row ${task.completed ? "completed" : ""}`}>
		    <Checkbox size="small" checked={Boolean(task.completed)} onChange={() => handleToggleCompleted(task)} />
				{editingId === task.id ? (
				   <TextField
				     value={editingText}
					 onChange={(e) => setEditingText(e.target.value)}
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
					 onClick={() => handleDeleteTask(task.id)}
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