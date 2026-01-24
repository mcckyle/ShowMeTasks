//****************************************************************************************
// Filename: TaskService.jsx
// Date: 20 January 2026
// Author: Kyle McColgan
// Description: This file contains the Task service for ShowMeTasks.
//****************************************************************************************

import request from "../api/apiClient";

//GET all tasks in a list.
export function getTasks(taskListId, token)
{
	return request(`/${taskListId}`, { token });
}

//CREATE a new task.
export function createTask({ taskListId, description}, token)
{
	return request("", {
		method: "POST",
		body: { taskListId, description},
		token,
	});
}

//UPDATE a task.
export function updateTask(taskId, payload, token)
{
	return request(`/${taskId}`, {
		method: "PUT",
		body: payload,
		token,
	});
}

//DELETE a task.
export function deleteTask(taskId, token)
{
	return request(`/${taskId}`, {
		method: "DELETE",
		token,
	});
}