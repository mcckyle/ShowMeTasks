//Filename: src/services/AuthService.js

//Check if the user is autheticated using the backend cookie.
export async function isAuthenticated(accessToken)
{
  try {
	  const response = await fetch('http://localhost:8080/api/auth/validate', {
		  method: 'GET',
		  headers: { "Authorization": `Bearer ${accessToken}` },
		  credentials: 'include' // important!!
	  });
	  
	  if ( ! response.ok)
	  {
		  return false;
	  }
	  
	  const data = await response.json();
	  return data.valid === true;
  }
  catch (error)
  {
	  console.error('Authentication check failed: ', error);
	  return false;
  }
}

//Register the user (backend sets HttpOnly cookie).
export async function registerUser(data)
{
	const response = await fetch(`http://localhost:8080/api/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include", // Enable cookies!!
		body: JSON.stringify(data)
	});
	
	if ( ! response.ok)
	{
		throw new Error("Registration failed!");
	}
	
	return await response.json();
}

//Login the user (backend sets HttpOnly cookie).
export async function loginUser(credentials)
{
	const response = await fetch(`http://localhost:8080/api/auth/signin`, {
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		credentials: 'include', // Enable cookies!!
		body: JSON.stringify(credentials)
	});
	
	if ( ! response.ok)
	{
		throw new Error("Invalid username or password!");
	}
	
	return await response.json(); // GET the user's accessToken, username, and email address.
}