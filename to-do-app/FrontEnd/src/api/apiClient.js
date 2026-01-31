//****************************************************************************************
// Filename: apiClient.js
// Date: 28 January 2026
// Author: Kyle McColgan
// Description: This file contains the API client for ShowMeTasks.
//****************************************************************************************

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/todos";

async function request(path, { method = "GET", token, body } = {})
{
	const headers = {};
	
	if (token)
	{
		headers.Authorization = `Bearer ${token}`;
	}
	
	if (body !== undefined)
	{
		headers["Content-Type"] = "application/json";
	}
	
	const response = await fetch(`${API_BASE}${path}`, {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
	
	if ( ! response.ok)
	{
		const message = await response.text();
		throw new Error(message || "API request failed!");
	}
	
	//204 No Content Safety...
	return response.status === 204 ? null : response.json();
}

export default request;