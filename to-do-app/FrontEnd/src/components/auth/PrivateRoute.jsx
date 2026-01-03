//Filename: src/components/auth/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// PrivateRoute Component
const PrivateRoute = ({ element }) => {
	const authorized = useAuth();
	
	if (authorized === null)
	{
		return (
		  <div className="loading-screen">
		    <div className="loading-spinner" />
			<p>Checking session...</p>
		  </div>
		);
	}
	
    return authorized ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;