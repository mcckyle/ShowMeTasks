//****************************************************************************************
// Filename: Settings.jsx
// Date: 20 January 2026
// Author: Kyle McColgan
// Description: This file contains the React Settings component for ShowMeTasks.
//****************************************************************************************


import React, { useContext, useEffect, useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal.jsx";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Settings.css";

const Settings = () => {
	const { user, accessToken } = useContext(AuthContext);
	const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
	const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "medium");
	
	//Modal State.
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [showDeleteAccount, setShowDeleteAccount] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	
	//Apply the Selected Theme.
	useEffect(() => {
		const root = document.documentElement;
		
		const applyTheme = (value) => {
			if (value === "system")
			{
				const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
				root.dataset.theme = isDark ? "dark" : "light";
			}
			else
			{
				root.dataset.theme = value;
			}
		};
		
		applyTheme(theme);
		localStorage.setItem("theme", theme);
		
		//Live update when using system theme.
		if (theme === "system")
		{
			const listener = (e) => {
				root.dataset.theme = e.matches ? "dark" : "light";
			};
			window.matchMedia("(prefers-color-scheme: dark)")
			  .addEventListener("change", listener);
			return () =>
			  window.matchMedia("(prefers-color-scheme: dark)")
			    .removeEventListener("change", listener);
		}
	}, [theme]);
	
	//Apply Font Size.
	useEffect(() => {
		const root = document.documentElement;
		root.dataset.fontSize = fontSize;
		localStorage.setItem("fontSize", fontSize);
	}, [fontSize]);
	
	//Change Password Handler.
	const handleChangePassword = async () => {
		try {
			const response = await fetch("http://localhost:8080/api/auth/change-password", {
				method: "PUT",
				headers: { 
				  "Content-Type": "application/json",
				  Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ newPassword })
			});
			
			if ( ! response.ok)
			{
				throw new Error();
			}
			
			toast.success("Password updated successfully!");
			setShowChangePassword(false);
			setNewPassword("");
		}
		catch
		{
			toast.error("Unable to update password.");
		}
	};
	
	//Delete Account Handler.
	const handleDeleteAccount = async () => {
		try {
			const response = await fetch("http://localhost:8080/api/auth/delete-account", {
				method: "DELETE",
				headers: { Authorization: `Bearer ${accessToken}` }
			});
			
			if ( ! response.ok)
			{
				throw new Error();
			}
			
			toast.success("Account deleted.");
			window.location.href = "/login";
		}
		catch
		{
			toast.error("Unable to delete account.");
		}
	};
	
	return (
	  <div className="settings-page">
	    <h1 className="settings-title">Settings</h1>
		
		{/* Preferences Section. */}
		<section className="settings-section">
		  <h2 className="settings-section-title">Preferences</h2>
		  
		  {/* Theme. */}
		  <div className="settings-card">
		    <div className="settings-card-header">
			  <h3 className="settings-card-title">Theme</h3>
			  <p className="settings-card-subtitle">Choose how the planner appears</p>
			</div>
			<div className="settings-options">
			  {["light", "dark", "system"].map((t) => (
			    <label key={t} className="settings-option">
			    <input
				  type="radio"
				  name="theme"
				  value={t}
				  checked={theme === t}
				  onChange={(e) => setTheme(e.target.value)}
				/>
				  {t.charAt(0).toUpperCase() + t.slice(1)}
			  </label>
			  ))}
			</div>
		  </div>
		  
		  {/* Font Size. */}
		  	<div className="settings-card">
		      <div className="settings-card-header">
			    <h3 className="settings-card-title">Font Size</h3>
			    <p className="settings-card-subtitle">Adjust text size for comfort</p>
			  </div>
			  
			  <div className="settings-options">
			    {["small", "medium", "large"].map((size) => (
				<label key={size} className="settings-option">
			    <input
				  type="radio"
				  name="fontsize"
				  value={size}
				  checked={fontSize === size}
				  onChange={(e) => setFontSize(e.target.value)}
				/>
				  {size.charAt(0).toUpperCase() + size.slice(1)}
			  </label>
			))}
			</div>
		  </div>
		</section>
		
		{/* Account Section. */}
		<section className="settings-section">
		  <h2 className="settings-section-title">Account</h2>
		  <div className="settings-card">
		    <div className="settings-card-header">
			  <h3 className="settings-card-title">Manage Account</h3>
			  <p className="settings-card-subtitle">Update or secure your account</p>
			</div>
			<div className="settings-actions">
			  <button
			    className="settings-action-btn"
				onClick={() => setShowChangePassword(true)}
			  >
			    Change Password
			  </button>
			  <button
			    className="settings-action-btn danger"
				onClick={() => setShowDeleteAccount(true)}
			  >
			    Delete Account
			  </button>
			</div>
		  </div>
		</section>
		
		{/* Change Password Modal. */}
		<ConfirmModal
		  open={showChangePassword}
		  title="Change Password"
		  message={
			  <div>
			    <p>Enter a new password below:</p>
				<input
				  type="password"
				  className="modal-input"
				  value={newPassword}
				  onChange={(e) => setNewPassword(e.target.value)}
				  placeholder="New password"
				/>
			  </div>
		  }
		  confirmLabel="Update Password"
		  onConfirm={handleChangePassword}
		  onClose={() => setShowChangePassword(false)}
		/>
		
		{/* Delete Account Modal. */}
		<ConfirmModal
		  open={showDeleteAccount}
		  title="Delete Account"
		  message="This action is permanent and cannot be undone."
		  confirmLabel="Delete"
		  onConfirm={handleDeleteAccount}
		  onClose={() => setShowDeleteAccount(false)}
		/>
	  </div>
	);
};

export default Settings;