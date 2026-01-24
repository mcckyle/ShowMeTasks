//****************************************************************************************
// Filename: DashboardLayout.jsx
// Date: 23 January 2026
// Author: Kyle McColgan
// Description: This file contains the DashboardLayout React component for ShowMeTasks.
//****************************************************************************************

import "./DashboardLayout.css";

const DashboardLayout = ({ header, content, composer, panel, panelOpen }) => {
  return (
   <div className="dashboard-root">
     <header className="dashboard-header">
	   <div className="dashboard-container">
	     {header}
	   </div>
	 </header>
	 
	 <main className="dashboard-main">
	   <div className="dashboard-grid">
	     {panel && (
		   <aside
		     className={`dashboard-panel ${panelOpen ? "open" : ""}`}
			 aria-label="Task lists"
		   >
		     {panel}
		   </aside>
		 )}
	   <section
	     className="dashboard-workspace"
		 role="region"
		 aria-label="Workspace"
		>
		  {content}
		</section>
	  </div>
	 </main>
	 
	 {composer && (
	   <footer className="dashboard-composer">
	    <div className="dashboard-container">
	     {composer}
		</div>
	   </footer>
	 )}
   </div>
   );
};

export default DashboardLayout;
	