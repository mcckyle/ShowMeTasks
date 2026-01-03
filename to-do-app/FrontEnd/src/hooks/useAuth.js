//Filename: src/hooks/useAuth.js

import { useState, useEffect, useContext } from 'react';
import { isAuthenticated } from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';

export default function useAuth()
{
	const { accessToken } = useContext(AuthContext);
	const [authorized, setAuthorized] = useState(null);
	
	useEffect(() => {
		let mounted = true;
		
		(async () => {
			if ( ! accessToken)
			{
				setAuthorized(false);
				return;
			}
			
			const result = await isAuthenticated(accessToken);
			
			if (mounted)
			{
				setAuthorized(result);
			}
        })();
	
		return () => { mounted = false; };
	}, [accessToken]); //Re-validate when the token changes.
	
	return authorized;
}