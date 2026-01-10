//****************************************************************************************
// Filename: Header.jsx
// Date: 6 January 2026
// Author: Kyle McColgan
// Description: This file contains the React Header component for ShowMeTasks.
//****************************************************************************************

import { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import "./Header.css";  // Import the CSS file here.

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  async function handleLogout(){
	  //Call global logout logic.
	  await logout(); //Redirect AFTER logout state is fully cleared.
	  navigate("/login", { replace: true }); 
  };
  
  //Close dropdown menu on outside click listener.
  useEffect(() => {
	  function handleClickOutside(e){
		  if ( (avatarRef.current) && ( ! avatarRef.current.contains(e.target)) )
		  {
			  setMenuOpen(false);
		  }
	  }
	  
	  if (menuOpen)
	  {
		  document.addEventListener("mousedown", handleClickOutside);
	  }
	  return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);
  
  const isActive = (path) => location.pathname === path;
  
  return (
	  <header className="header">
		<div className="header-inner">
		
		  {/* Left Logo. */}
		  <Link to="/tasks" className="logo">
		    ShowMeTasks
		  </Link>
		
		  {/* Primary Navigation. */}
		  <nav className="nav" aria-label="Primary navigation">
		    <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>Home</Link>
		    <Link to="/tasks" className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>
		  </nav>
		
		  {/* Right Side: Auth / User Avatar. */}
		  <div className="header-actions">
		  {user ? (
		    <div
			  className="avatar-wrapper"
			  ref={avatarRef}
			  tabIndex={0}
			  aria-haspopup="menu"
			  aria-expanded={menuOpen}
		      onClick={() => setMenuOpen((prev) => ! prev)}
			  onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
			>
			  <div className="avatar" aria-hidden>
			    {user.username?.charAt(0).toUpperCase() || "?"}
			  </div>
			  
			  <div className={`menu ${menuOpen ? "open" : ""}`} role="menu">
			    <Link to="/profile" className="menu-item" onClick={() => setMenuOpen(false)}>
				  Profile
				</Link>
				<Link to="/settings" className="menu-item" onClick={() => setMenuOpen(false)}>
				  Settings
				</Link>
				<div className="menu-divider" />
				<button className="menu-item danger" onClick={handleLogout}>
				  Log out
				</button>
			  </div>
			</div>
		) : (
		  <div className="auth-links">
		    <Link to="/login" className="auth-link">Login</Link>
		    <Link to="/register" className="auth-link primary">Register</Link>
		  </div>
		)}
		</div>
	  </div>
	</header>
  );
};

export default Header;