//****************************************************************************************
// Filename: DashboardLayout.jsx
// Date: 11 January 2026
// Author: Kyle McColgan
// Description: This file contains the DashboardLayout React component for ShowMeTasks.
//****************************************************************************************

import "./DashboardLayout.css";

const DashboardLayout = ({ header, content, composer, panel }) => {
  return (
   <div className="dashboard-root">
     <div className="dashboard-shell">
       <div className="dashboard-workspace">
	     {header}
	     {content}
	   </div>
	 </div>
	 
	 {composer}
	 {panel}
   </div>
   );
};

export default DashboardLayout;
	