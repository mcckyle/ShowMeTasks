//****************************************************************************************
// Filename: ListsPanel.jsx
// Date: 7 January 2026
// Author: Kyle McColgan
// Description: This file contains the ListsPanel React component for ShowMeTasks.
//****************************************************************************************

import { Card, Typography } from "@mui/material";
import "./ListsPanel.css";

const ListsPanel = ({ open, lists, selected, onSelect, onClose }) => {
  if ( ! open)
  {
    return null;
  }
  
  return (
    <div className="lists-panel-overlay" onClick={onClose}>
	  <aside className="lists-panel" onClick={(e) => e.stopPropagation()}>
	    <Typography className="lists-title">Task Lists</Typography>
		
		{lists.map((list) => (
		  <Card
		    key={list.id}
			className={`lists-item ${selected?.id === list.id ? "active" : ""}`}
			onClick={() => { onSelect(list); onClose(); }}
		  >
		    {list.name}
		  </Card>
		))}
	  </aside>
	</div>
	);
};

export default ListsPanel;