//****************************************************************************************
// Filename: WorkspaceHeader.jsx
// Date: 10 January 2026
// Author: Kyle McColgan
// Description: This file contains the WorkspaceHeader React component for ShowMeTasks.
//****************************************************************************************

import { Typography, Button } from "@mui/material";
import "./WorkspaceHeader.css";

const WorkspaceHeader = ({ list, onOpenLists }) => {
  return (
    <header className="workspace-header">
	  <div className="workspace-header-main">
	    <Typography className="workspace-title">
		  {list ? list.name : "Your Workspace"}
		</Typography>
		{list && (
		  <Typography className="workspace-meta">
		    {list.tasks?.length || 0} tasks
		  </Typography>
		)}
	  </div>
	  
	  <Button size="small" className="workspace-action" onClick={onOpenLists}>
	    Lists
	  </Button>
	</header>
  );
};

export default WorkspaceHeader;