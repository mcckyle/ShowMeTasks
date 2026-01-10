//****************************************************************************************
// Filename: WorkspaceContent.jsx
// Date: 7 January 2026
// Author: Kyle McColgan
// Description: This file contains the WorkspaceContent React component for ShowMeTasks.
//****************************************************************************************

import "./WorkspaceContent.css";

const WorkspaceContent = ({ children }) => {
  return (
    <main className="workspace-content">
	  {children}
	</main>
  );
};

export default WorkspaceContent;