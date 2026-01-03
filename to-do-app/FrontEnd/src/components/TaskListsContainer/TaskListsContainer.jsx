//****************************************************************************************
// Filename: TaskListsContainer.jsx
// Date: 02 November 2025
// Author: Kyle McColgan
// Description: This file contains the React TaskListsContainer component for ShowMeTasks.
//****************************************************************************************

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Box, Card, Typography, Grid, TextField} from '@mui/material';
import {Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './TaskListsContainer.css';

const TaskListsContainer = ({ onLogout, user }) => {
    const [taskLists, setTaskLists] = useState([]);
    const [selectedTaskListId, setSelectedTaskListId] = useState(null);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false); //Needs removed.
    const [newTask, setNewTask] = useState('');
	const [open, setOpen] = useState(false);
    const [newListName, setNewListName] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
	
	const handleDeleteTask = async (taskId) => {
		if (!taskId)
		{
			console.error('Error: No taskId provided for deletion');
			return;
		}

		try
		{
			const response = await fetch(`http://localhost:8080/api/todos/${taskId}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${user.token}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok)
			{
				setTodos((prevTodos) => prevTodos.filter((task) => task.id !== taskId));
				console.log(`Successfully deleted task with ID: ${taskId}`);
			}
			else
			{
				const errorMessage = await response.text();
				console.error(`Failed to delete task with ID ${taskId}. Server responded with: ${response.status} - ${errorMessage}`);
			}
		}
		catch (error)
		{
			console.error('Error deleting task: ', error.message || error);
		}
	};

    const handleCreateList = async () => {
		if (newListName.trim())
		{
			try
			{
				const response = await fetch('http://localhost:8080/api/todos/list/create', {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${user.token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ name: newListName }),
				});
				const data = await response.json();
				console.log('Created new task list:', data);
				setTaskLists((prev) => [...prev, data]); // Add the new list to the React state.
				setNewListName(''); // Clear the input field.
				handleClose(); // Close the dialog.
			}
			catch (error)
			{
				console.error('Error creating task list:', error);
			}
		}
		else
		{
			alert('Please enter a task list name');
		}
	};

	const fetchTaskLists = useCallback(async (username) => {
		setLoading(true);
		try
		{
			const response = await fetch(`http://localhost:8080/api/todos/list/${username}`, {
				headers: { 'Authorization': `Bearer ${user.token}` },
			});

			if (response.status === 204)
			{
				setTaskLists([]);
				return;
			}

			if (!response.ok)
			{
				throw new Error(`Error: ${response.status}`);
			}

			const data = await response.json();
			setTaskLists(data.map((item) => ({
				...item,
				tasks: Array.isArray(item.tasks) ? item.tasks : [],
			})));
			if (data.length > 0) setSelectedTaskListId(data[0].id);
		}
		catch (error)
		{
			console.error('Error fetching task lists:', error);
		}
		finally
		{
			setLoading(false);
		}
	}, [user.token]);

    const fetchTodos = useCallback(async (taskListId) => {
		try
		{
			const response = await fetch(`http://localhost:8080/api/todos/${taskListId}`, {
				headers: { 'Authorization': `Bearer ${user.token}` },
			});

			if (response.status === 204)
			{
				setTodos([]);  // Set an empty array if no tasks are found.
				return;
			}

			const data = await response.json();
			setTodos(data || []);  // Safeguard for empty or undefined response.

		}
		catch (error)
		{
			console.error('Error fetching todos:', error);
		}
	}, [user.token]);

    const handleTabChange = (newListId) => {
        setSelectedTaskListId(newListId);
        fetchTodos(newListId);
    };

    const handleNewTaskChange = (event) => {
        setNewTask(event.target.value);
    };

    const handleAddTask = async () => {
		if (newTask.trim() !== '')
		{
			try
			{
				// Step 1: Add the new task to the server...
				const response = await fetch(`http://localhost:8080/api/todos/create`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${user.token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						taskListId: selectedTaskListId,
						description: newTask,
					}),
				});

				if (!response.ok)
				{
					throw new Error('Failed to add task');
				}

				const newTaskData = await response.json();

				// Step 2: Update the UI optimistically.
				setTaskLists((prevLists) =>
					prevLists.map((list) =>
						list.id === selectedTaskListId
							? { ...list, tasks: [...(list.tasks || []), newTaskData] }
							: list
					)
				);

				// Update the todos for the selected task list.
				if (selectedTaskListId)
				{
					setTodos((prevTodos) => [...(prevTodos || []), newTaskData]);
				}

				setNewTask(''); // Clear the input field.
			}
			catch (error)
			{
				console.error('Error adding or fetching tasks:', error);
			}
		}
	};
	
    useEffect(() => {
        fetchTaskLists(user.username);
    }, [user, fetchTaskLists]);

    useEffect(() => {
        if (selectedTaskListId) fetchTodos(selectedTaskListId);
    }, [selectedTaskListId, fetchTodos]);

    return (
		<Box className="task-list-container">
			{/* New Task List Button */}
			<Box className="new-task-list-btn-container">
				{/* New Task List Button */}
				<Button
				  className="create-task-btn"
				  onClick={handleClickOpen}
				  variant="contained"
				  disableElevation
				>
					+ New List
				</Button>
				{/* Dialog for Creating Task List */}
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Create New Task List</DialogTitle>
					<DialogContent>
						<TextField
							value={newListName}
							onChange={(e) => setNewListName(e.target.value)}
							label="Task List Name"
							fullWidth
							autoFocus //Manage the focus.
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="secondary">
							Cancel
						</Button>
						<Button onClick={handleCreateList} color="primary">
							Create
						</Button>
					</DialogActions>
				</Dialog>	
			</Box>

			{/* Display Task Lists */}
			<Grid container className="task-list-grid">
				{taskLists.map((list) => (
					<Grid item xs={12} sm={6} md={4} key={list.id}>
						<Card
							onClick={() => handleTabChange(list.id)}
							className={`card-container ${selectedTaskListId === list.id ? 'selected' : ''}`}
						>
							<Typography className="task-list-title">{list.name}</Typography>
							<Typography className="task-list-subtitle">
								{list.tasks?.length || 0} task{list.tasks?.length !== 1 ? 's' : ''}
							</Typography>
						</Card>
					</Grid>
				))}
			</Grid>

			{/* Task List Content */}
			{selectedTaskListId && (
				<>
					<Card className="task-list-card">
						<Typography className="task-list-card-title">
							Tasks in {taskLists.find((list) => list.id === selectedTaskListId)?.name}
						</Typography>

			<Grid container className="tasks-grid">
				{todos.length === 0 ? (
					<Grid item xs={12}>
						<Typography className="no-tasks-msg">
							No tasks yet - Add your first task below.
						</Typography>
					</Grid>
				) : (
					todos.map((task) => (
						<Grid item xs={12} key={task.id}>
							<Card className="task-item">
								<Typography>{task.description}</Typography>
								<Button
									className="delete-task-btn"
									onClick={() => handleDeleteTask(task.id)}
								>
									Delete
								</Button>
							</Card>
						</Grid>
					))
				)}
			</Grid>

						<Box className="inline-task-creation">
							<TextField
								value={newTask}
								onChange={handleNewTaskChange}
								label="New Task"
								className="inline-task-input"
							/>
							<Button
								className="add-task-btn"
								onClick={handleAddTask}
								disabled={!newTask.trim()}
							>
								Add Task to list
							</Button>
						</Box>
					</Card>
				</>
			)}
		</Box>
	);			
};

export default TaskListsContainer;