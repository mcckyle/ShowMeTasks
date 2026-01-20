//****************************************************************************************
// Filename: ListsPanel.jsx
// Date: 19 January 2026
// Author: Kyle McColgan
// Description: This file contains the ListsPanel React component for ShowMeTasks.
//****************************************************************************************

import { Typography, Divider } from "@mui/material";
import CreateTaskList from "../CreateTaskList/CreateTaskList";
import "./ListsPanel.css";

const ListsPanel = ({ open, lists, selected, onSelect, onClose }) => {
  return (
	<aside
	  className={`lists-panel ${open ? "open" : ""}`}
	  role="navigation"
	  aria-label="Task lists"
	>
	  <header className="lists-header">
		<Typography className="lists-title">Task Lists</Typography>
	  </header>
	  
	  <CreateTaskList />
	  
	  <Divider className="lists-divider" />
		
	  <nav className="lists-items">
		 {lists.map((list) => (
		  <button
			key={list.id}
			className={`lists-item ${selected?.id === list.id ? "active" : ""}`}
			onClick={() => onSelect(list)}
			aria-current={selected?.id === list.id ? "true" : undefined}
		  >
			{list.name}
		  </button>
		))}
	  </nav>
		
		{/* Mobile-only Close Button. */}
		<button className="lists-close" onClick={onClose}>
		  Close lists
		</button>
	  </aside>
	);
};

export default ListsPanel;