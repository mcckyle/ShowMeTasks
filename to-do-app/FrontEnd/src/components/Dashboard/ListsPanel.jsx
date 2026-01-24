//****************************************************************************************
// Filename: ListsPanel.jsx
// Date: 23 January 2026
// Author: Kyle McColgan
// Description: This file contains the ListsPanel React component for ShowMeTasks.
//****************************************************************************************

import { Typography, Divider } from "@mui/material";
import CreateTaskList from "../CreateTaskList/CreateTaskList";
import "./ListsPanel.css";

const ListsPanel = ({ open, lists, selected, onSelect, onClose, selectionMode, setSelectionMode, selectedIds, toggleSelection, onDeleteSelected, clearSelection }) => {
  return (
	<aside
	  className={`lists-panel ${open ? "open" : ""}`}
	  role="navigation"
	  aria-label="Task lists"
	>
	  <header className="lists-header">
		<Typography className="lists-title">Task Lists</Typography>
		
		{! selectionMode ? (
		  <button
		    className="lists-edit"
			onClick={() => setSelectionMode(true)}
			aria-label="Cancel list selection"
		  >
		    Edit
		  </button>
		) : (
		  <button
		    className="lists-edit"
			onClick={clearSelection}
			aria-label="Cancel list selection"
		  >
		    Cancel
		  </button>
		)}
	  </header>
	  
	  <CreateTaskList />
	  
	  <Divider className="lists-divider" />
		
	  <nav className="lists-items">
		 {lists.map(list => {
		  const checked = selectedIds.has(list.id);
		  const isActive = selected?.id === list.id;
		  
		  return (
		    <div
			  key={list.id}
			  className={`lists-row ${checked ? "checked" : ""}`}
			>
			  {selectionMode && (
			    <input
				  type="checkbox"
				  checked={checked}
				  onChange={() => toggleSelection(list.id)}
				  aria-label={`Select ${list.name}`}
				/>
			  )}
		  <button
			className={`lists-item ${isActive ? "active" : ""}`}
			onClick={() => selectionMode ? toggleSelection(list.id) : onSelect(list)}
			aria-current={isActive ? "true" : undefined}
		  >
			{list.name}
		  </button>
		</div>
		);
		})}
	  </nav>
	  
	  {selectionMode && selectedIds.size > 0 && (
	    <div className="lists-bulk-bar" role="region" aria-label="Bulk actions">
		  <span>{selectedIds.size} selected</span>
		  
		  <button
		    className="lists-delete"
			onClick={onDeleteSelected}
			aria-label="Delete selected lists"
		  >
		    Delete
		  </button>
		</div>
	  )}
		
		{/* Mobile-only Close Button. */}
		<button className="lists-close" onClick={onClose}>
		  Close lists
		</button>
	  </aside>
	);
};

export default ListsPanel;