//****************************************************************************************
// Filename: ListsPanel.jsx
// Date: 11 January 2026
// Author: Kyle McColgan
// Description: This file contains the ListsPanel React component for ShowMeTasks.
//****************************************************************************************

import { Card, Typography, Divider } from "@mui/material";
import CreateTaskList from "../CreateTaskList/CreateTaskList";
import "./ListsPanel.css";

const ListsPanel = ({ open, lists, selected, onSelect, onClose }) => {
	
  if ( ! open)
  {
    return null;
  }
  
  return (
    <div
	  className="lists-panel-overlay"
	  role="dialog"
	  aria-modal="true"
	  aria-label="Task lists"
	  onClick={onClose}
	>
	  <aside className="lists-panel" onClick={(e) => e.stopPropagation()}>
	    <Typography className="lists-title">Task Lists</Typography>
		
		<CreateTaskList />
		
		<Divider className="lists-divider" />
		
		<nav className="lists-items">
		 {lists.map((list) => (
		  <Card
		    key={list.id}
			className={`lists-item ${selected?.id === list.id ? "active" : ""}`}
			onClick={() => { onSelect(list); onClose(); }}
			tabIndex={0}
		  >
		    {list.name}
		  </Card>
		))}
	    </nav>
	  </aside>
	</div>
	);
};

export default ListsPanel;