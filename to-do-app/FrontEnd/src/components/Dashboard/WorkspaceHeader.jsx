//****************************************************************************************
// Filename: WorkspaceHeader.jsx
// Date: 23 January 2026
// Author: Kyle McColgan
// Description: This file contains the WorkspaceHeader React component for ShowMeTasks.
//****************************************************************************************

import { Typography, Button } from "@mui/material";
import "./WorkspaceHeader.css";

const WorkspaceHeader = ({ list, onOpenLists }) => {
  const taskCount = list?.tasks?.length ?? 0;
  
  return (
    <header className="workspace-header">
	  <div className="workspace-header-main">
	    <Typography className="workspace-title" component="h1" title={list?.name}>
		  {list ? list.name : "Your Workspace"}
		</Typography>
		{list && (
		  <Typography className="workspace-meta">
		    {taskCount} {taskCount === 1 ? "task" : "tasks"}
		  </Typography>
		)}
	  </div>
	  
	  <Button
	    size="small"
		variant="text"
		className="workspace-action"
		onClick={onOpenLists}
		aria-label="Open task lists"
	  >
	    Lists
	  </Button>
	</header>
  );
};

export default WorkspaceHeader;