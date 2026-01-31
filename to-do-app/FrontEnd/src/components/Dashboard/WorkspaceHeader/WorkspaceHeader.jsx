//****************************************************************************************
// Filename: WorkspaceHeader.jsx
// Date: 29 January 2026
// Author: Kyle McColgan
// Description: This file contains the WorkspaceHeader React component for ShowMeTasks.
//****************************************************************************************

import "./WorkspaceHeader.css";

const WorkspaceHeader = ({ list, onOpenLists }) => {
  const taskCount = list?.tasks?.length ?? 0;
  
  return (
    <header className="workspace-header">
	  <div className="workspace-header-main">
	    <h1 className="workspace-title" title={list?.name}>
		  {list ? list.name : "Your Workspace"}
		</h1>
		{list && (
		  <span className="workspace-meta">
		    {taskCount} {taskCount === 1 ? "task" : "tasks"}
		  </span>
		)}
	  </div>
	  
	  <button
		className="workspace-action"
		onClick={onOpenLists}
		aria-label="Open task lists"
		title="Open task lists"
	  >
	    Lists
	  </button>
	</header>
  );
};

export default WorkspaceHeader;