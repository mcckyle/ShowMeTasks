//Filename: src/api/apiClient.js

const BASE_URL = "http://localhost:8080/api";

async function request(endpoint, method = "GET", body = null)
{
	const options = {
		method,
		credentials: "include", //Send cookies, if needed.
		headers: { "Content-Type": "application/json" },
	};
	
	if (body)
	{
		options.body = JSON.stringify(body);
	}
	
	const response = await fetch(`${BASE_URL}${endpoint}`, options);
	
	if ( ! response.ok)
	{
		const message = await response.text();
		throw new Error(message || "Request failed!");
	}
	
	return response.json();
}

export const PersonAPI = {
	getMyPeople: () => request("/person/my"),
	addPerson: (data) => request("/person/add", "POST", data),
};

export const UserAPI = {
	me: () => request("/users/me"),
};

export async function loginUser(email, password)
{
	return request("/auth/signin", "POST", { email, password });
}

export async function registerUser(email, password)
{
	return request("/auth/register", "POST", { email, password });
}