//****************************************************************************************
// Filename: TaskListView.jsx
// Date: 2 January 2026
// Author: Kyle McColgan
// Description: This file contains the TaskListView React component for ShowMeTasks.
//****************************************************************************************

import React, { useState, useEffect } from "react";
import { Card, Typography, Button, TextField } from "@mui/material";

const TaskListView = ({ user, token, selectedList }) => {
	const [todos, setTodos] = useState([]);
	const [newTask, setNewTask] = useState("");
	
	useEffect(() => {
		if ( ( ! selectedList) || ( ! token) )
		{
			return;
		}
		
		const fetchTodos = async () => {
			try
			{
				const result = await fetch(`http://localhost:8080/api/todos/${selectedList.id}`, {
					headers: { Authorization: `Bearer ${token}` },
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
	}, [selectedList, token]);
	
	const handleAddTask = async () => {
		try
		{
			const result = await fetch('http://localhost:8080/api/todos/create', {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ taskListId: selectedList.id, description: newTask }),
			});
			
			const newTaskData = await result.json();
			setTodos((prev) => [...prev, newTaskData]);
			setNewTask("");
		}
		catch (error)
		{
			console.error("Error adding task: ", error);
		}
	};
	
	const handleDelete = async (id) => {
		try
		{
			await fetch(`http://localhost:8080/api/todos/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});

			setTodos((prev) => prev.filter((t) => t.id !== id));
		}
		catch (error)
		{
			console.error("Error deleting task: ", error);
		}
	};
	
	if (!selectedList) return <Typography>Select a task list to view tasks.</Typography>;
	
	return (
	  <Card className="task-view">
	    <Typography variant="h6">Tasks in {selectedList.name}</Typography>
			{todos.length === 0 ? (
			  <Typography>No tasks yet. Add your first task below!</Typography>
			 ) : (
			   todos.map((task) => (
			     <div key={task.id} className="task.item">
				   <span>{task.description}</span>
				   <Button onClick={() => handleDelete(task.id)} color="error">Delete</Button>
				 </div>
			  ))
			)}
			
			<div className="task-input">
			  <TextField
			    value={newTask}
				onChange={(e) => setNewTask(e.target.value)}
				label="New Task"
				fullWidth
			  />
			  <Button onClick={handleAddTask} disabled={!newTask.trim()}>Add</Button>
			</div>
		</Card>
	);
};

export default TaskListView;