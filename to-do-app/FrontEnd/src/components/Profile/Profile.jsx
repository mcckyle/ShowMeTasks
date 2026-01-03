//Filename: src/components/Profile/Profile.jsx

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Profile.css"; // Import the CSS file.

const Profile = () => {
	const navigate = useNavigate();
	const { user, logout, accessToken, setUser } = useContext(AuthContext);
	
	const [openEdit, setOpenEdit] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	
	const [editData, setEditData] = useState({
		username: "",
		email: "",
		bio: ""
	});
	
	function openEditor() {
		setEditData({
			username: user.username || "",
			email: user.email || "",
			bio: user.bio || "",
		});
		setOpenEdit(true);
		setError("");
	};
	const closeEditor = () => setOpenEdit(false);
	const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });
	
	//Save profile changes.
	const handleSave = async() => {
		if ( ( ! editData.username.trim() ) || ( ! editData.email.trim()) )
		{
			return;
		}
		
		try
		{
			setSaving(true);
			
			const response = await fetch("http://localhost:8080/api/users/update", {
				method: "PUT",
				credentials: "include", //Use cookie-based auth.
				headers: {
					"Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(editData),
			});
			
			if ( ! response.ok)
			{
				throw new Error("Failed to update profile!");
			}
			
			const result = await response.json();
			setUser(result.user);
			setOpenEdit(false);
		}
		catch (error)
		{
			setError(error.message);
		}
		finally
		{
			setSaving(false);
		}
	};
	
	const handleLogout = async () => {
		await logout();
		navigate("/signin", { replace: true });
	};
	
	//Early return if user is null.
	if ( ! user)
	{
		return (
		  <p>Redirecting...</p>
		);
	}
	
	return (
	  <section className="profile-card">
	    <header className="profile-header">
		  <h1>{user.username}</h1>
		  <p>Account details</p>
		</header>
		
		<div className="profile-info">
		  <div>
		    <span>Email</span>
			<p>{user.email}</p>
		  </div>
		  <div>
		    <span>Bio</span>
		    <p>{user.bio || "No bio added yet."}</p>
		  </div>
		</div>
		
		<div className="profile-actions">
		    <button className="button" onClick={openEditor}>Edit Profile</button>
			<button className="button danger" onClick={handleLogout}>Log out</button>
		</div>
		  
		{error && <p className="profile-error">{error}</p>}
		  
		{/* Modal */}
		{openEdit && (
		   <div className="modal-overlay" onClick={closeEditor}>
		    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
			  <h2>Edit Profile</h2>
			  
			  <input
			    className="input"
			    name="username"
				value={editData.username}
				onChange={handleChange}
				placeholder="Username"
			  />
			  
			  <input
			    className="input"
				type="email"
			    name="email"
				value={editData.email}
				onChange={handleChange}
				placeholder="Email"
			  />
			  
			  <textarea
			    className="input textarea"
			    name="bio"
				value={editData.bio}
				onChange={handleChange}
				placeholder="Short bio"
			  />
			  
			  <div className="modal-actions">
			    <button
				  className="button"
				  onClick={handleSave}
				  disabled={saving}
				>
				  {saving ? "Saving..." : "Save changes"}
				</button>
				
				<button className="button secondary" onClick={closeEditor}>
				  Cancel
				</button>
			  </div>
			</div>
		  </div>
		)}
	  </section>		  
    );
};

export default Profile;