//****************************************************************************************
// Filename: HomePage.jsx
// Date: 4 January 2026
// Author: Kyle McColgan
// Description: This file contains the React HomePage component for ShowMeTasks.
//****************************************************************************************

import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
	return (
	  <main className="home">
	    {/* Hero Section. */}
	    <section className="home-hero">
		  <span className="home-eyebrow">Simple task management</span>
		  
		    <h1 className="home-title">
			  Focus on what matters
			</h1>
			
			<p className="home-subtitle">
		      ShowMeTasks helps you organize your work into clear,
			  purposeful task lists - without distractions.
		    </p>
			
			<div className="home-actions">
		      <Link to="/dashboard" className="home-cta">
			    Go to dashboard
			  </Link>
		    </div>
		</section>
		
		{/* Feature Cards Grid. */}
		<section className="home-grid">
		  <article className="home-card">
		    <h2 className="card-title">Stay organized</h2>
			<p className="card-text">
			  Group related tasks into lists that are easy to maintain and revisit.
			</p>
		  </article>
		  
		  <article className="home-card">
		    <h2 className="card-title">Capture ideas instantly</h2>
			<p className="card-text">
			  Add tasks the moment they come to mind - no friction,
			  no clutter.
			</p>
		  </article>
		  
		  <article className="home-card">
		    <h2 className="card-title">Work with intention</h2>
			<p className="card-text">
			  Create task lists that reflect priorities, not noise.
			</p>
		  </article>
		</section>
	  </main>
	);
};

export default HomePage;