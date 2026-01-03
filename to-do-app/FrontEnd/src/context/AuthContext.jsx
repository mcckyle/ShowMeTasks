//Filename: src/context/AuthContext.jsx

import { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/AuthService";

export const AuthContext = createContext(null);

export function AuthProvider({ children })
{
    const [accessToken, setAccessToken] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	
	//Dedicated cleanup effect: reset user when accessToken is cleared.
	useEffect(() => {
		if ( ! accessToken)
		{
			setUser(null);
		}
	}, [accessToken]);
	
	//Fetch the current user from /me endpoint.
	const fetchUser = async (token) => {
		try
		{
			const response = await fetch("http://localhost:8080/api/auth/me", {
				method: "GET",
				credentials: "include",
				headers: { Authorization: `Bearer ${token}`,
                           "Content-Type": "application/json"
				},
			});
			
			//For debugging purposes...
			if ( ! response.ok)
			{
				console.warn("fetchUser: /me returned not OK: ", response.status);
				setUser(null);
				return;
			}
			
			const data = await response.json().catch(() => null);
			
			if ( ( ! data) || (typeof data !== "object") )
			{
				console.warn("fetchUser: /me returned invalid JSON: ", data);
				setUser(null);
				return;
			}
			
			//Ensure required fields are present.
			if ( ! data.username)
			{
				console.warn("fetchUser: /me missing username: ", data);
				setUser(null);
				return;
			}
			
			setUser(data);
		}
		catch (error)
		{
			console.error("fetchUser error: ", error);
			setUser(null);
		}
	};
	
	//Attempt to refresh the accessToken on page load.
	useEffect(() => {
		const attemptRefresh = async () => {
			try
			{
				if (accessToken)
				{
					return; //Skip refresh if already logged in.
				}
				
				const response = await fetch("http://localhost:8080/api/auth/refresh", {
					method: "POST",
					credentials: "include",
				});
				
				if (response.ok)
				{
					const data = await response.json();
					setAccessToken(data.accessToken);
					await fetchUser(data.accessToken); //Fetch the user immediately.
				}
				else
				{
					setUser(null);
					setAccessToken(null);
				}
			}
			catch (error)
			{
				console.log("Refresh failed: ", error);
				setUser(null);
				setAccessToken(null);
			}
			finally
			{
				setLoading(false);
			}
		};
		
		attemptRefresh();
	}, [accessToken]);
	
	//New login helper...
	const login = async (credentials) => {
		const loginResponse = await loginUser(credentials);
		
		if ( ! loginResponse.accessToken)
		{
			throw new Error("Login succeeded but no access token returned!");
		}
		
		const token = loginResponse.accessToken;
		setAccessToken(token);
		
		//Fetch /me using the accessToken explicitly.
		const response = await fetch("http://localhost:8080/api/auth/me", {
			method: "GET",
			credentials: "include",
			headers: { Authorization: `Bearer ${token}`,
                       "Content-Type": "application/json"
			},
		});
		
		if ( ! response.ok)
		{
			const text = await response.text().catch(() => "");
			throw new Error(`/me failed: ${response.status} ${text}`);
		}
		
		const data = await response.json();
		setUser(data);
	};
	
	const logout = async () => {
		try
		{
			//Invalidate the refresh token cookie.
			await fetch("http://localhost:8080/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
		}
		catch (error)
		{
			console.error("Logout backend error: ", error);
		}
		
		//Clear React state.
		setAccessToken(null);
		setUser(null);
	};
	
	//Wait until refresh attempt finishes before rendering any children.
	if (loading)
	{
		return null;
	}

    return (
        <AuthContext.Provider value={{
			accessToken,
			setAccessToken,
			user,
			setUser,
			login,
			logout
		}}>
            {children}
        </AuthContext.Provider>
    );
}