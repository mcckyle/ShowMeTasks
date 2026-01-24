//****************************************************************************************
// Filename: ListService.jsx
// Date: 21 January 2026
// Author: Kyle McColgan
// Description: This file contains the List service for ShowMeTasks.
//****************************************************************************************

import request from "../api/apiClient";

//GET The Default List.
export function getDefaultList(token)
{
	return request("/list/default", { token });
}

//GET all lists for The User.
export function getLists(token)
{
	return request("/list", { token });
}

//CREATE a new list.
export function createList(data, token)
{
	return request("/list", {
		method: "POST",
		body: data,
		token,
	});
}

//UPDATE a list name.
export async function updateList(id, payload, token)
{
	return request(`/list/${id}`, {
		method: "PUT",
		body: payload,
		token,
	});
}

//Delete a list.
export async function deleteList(id, token)
{
	return request(`/list/${id}`, {
		method: "DELETE",
		token,
	});
}