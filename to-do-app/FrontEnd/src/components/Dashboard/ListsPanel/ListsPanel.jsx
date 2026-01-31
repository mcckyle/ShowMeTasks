//****************************************************************************************
// Filename: ListsPanel.jsx
// Date: 30 January 2026
// Author: Kyle McColgan
// Description: This file contains the ListsPanel React component for ShowMeTasks.
//****************************************************************************************

import { useState, useEffect, useMemo, useContext } from "react";
import { createList } from "../../../services/ListService";
import { AuthContext } from "../../../context/AuthContext";
import CreateTaskList from "../../CreateTaskList/CreateTaskList";
import "./ListsPanel.css";

const formatTodayName = () => {
	const now = new Date();
	return now.toLocaleDateString(undefined, {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

const ListsPanel = ({
	open,
	lists,
	trashedLists = [],
	selected,
	onSelect,
	onClose,
	selectionMode,
	setSelectionMode,
	selectedIds,
	toggleSelection,
	onCreated,
	onDeleteSelected,
	onRestore,
	onPermanentDelete,
	clearSelection,
}) => {
  const { accessToken } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [panelView, setPanelView] = useState("active"); //"active" || "trash".
  
  //Search lists feature...
  const visibleLists = useMemo(() => {
	  const source = panelView === "trash" ? trashedLists : lists;
	  
	  if ( ! search.trim())
	  {
		  return source;
	  }
	  
	  const q = search.toLowerCase();
	  return source.filter(list =>
	    list.name.toLowerCase().includes(q)
	  );
  }, [lists, trashedLists, panelView, search]);
  
  const handleCreateNamed = async (name) => {
	  const newList = await createList({ name }, accessToken);
	  
	  if (onCreated)
	  {
		  //Notify the parent (Dashboard) so it updates lists automatically.
		  onCreated(newList);
	  }
	  
	  //Also, select the new list...
	  if (onSelect)
	  {
		  onSelect(newList);
	  }
	  
	  setSearch(""); //Clear the search input after creating a new list.
  };
  
  //Handle list of the day feature...
  const handleCreateToday = async () => {
	  const name = `${formatTodayName()}`;
	  const newList = await createList({ name }, accessToken);
	  
	  if (onCreated)
	  {
		  //Notify the parent (Dashboard) so it updates lists automatically.
		  onCreated(newList);
	  }
	  
	  //Also, select the new list...
	  if (onSelect)
	  {
		  onSelect(newList);
	  }
	  
	  setSearch(""); //Clear the search input after creating a new list.
  };
  
  useEffect(() => {
	  if (panelView === "trash")
	  {
		  clearSelection();
		  setSelectionMode(false);
	  }
  }, [panelView]);
  
  return (
	<aside
	  className={`lists-panel ${open ? "open" : ""}`}
	  role="navigation"
	  aria-label="Task lists"
	>
	  <header className="lists-header">
		<h2 className="lists-title">Task Lists</h2>
		
		{! selectionMode ? (
		  <button
		    className="lists-edit"
			onClick={() => setSelectionMode(true)}
			aria-label="Edit lists"
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
	  
	  <CreateTaskList
	    onCreateNamed={handleCreateNamed}
		onCreateToday={handleCreateToday}
      />
	  
	  <div className="lists-search">
	    <input
		  type="search"
		  placeholder="Search lists…"
		  value={search}
		  onChange={(e) => setSearch(e.target.value)}
		  onKeyDown={(e) => { if (e.key === "Escape") setSearch(""); }}
		  aria-label="Search task lists"
		/>
	  </div>
	  
	  <hr className="lists-divider" />
		
	  <nav className="lists-items" aria-label="Task lists">
		 {visibleLists.map(list => {
		  const checked = selectedIds.has(list.id);
		  const isActive = selected?.id === list.id;
		  
		  return (
		    <li key={list.id} className={`lists-row ${checked ? "checked" : ""}`}>
			  { (panelView === "active") && (selectionMode) && (
			    <input
				  type="checkbox"
				  checked={checked}
				  onChange={() => toggleSelection(list.id)}
				  aria-label={`Select ${list.name}`}
				/>
			  )}
			  
			  <button
			    className={`lists-item ${isActive ? "active" : ""}`}
			    onClick={() => {
				  setSearch("");
				  if (panelView === "active") {
				    selectionMode ? toggleSelection(list.id) : onSelect(list);
				  }
			    }}
			    aria-current={isActive ? "true" : undefined}
		      >
			    {list.name}
		      </button>
			  
			  {panelView === "trash" && (
			    <div className="lists-trash-actions">
				  <button onClick={() => onRestore(list.id)}>Restore</button>
				  <button
				    className="danger"
					onClick={() => onPermanentDelete(list.id)}
				  >
				    Delete
				  </button>
				</div>
			  )}
			</li>
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
	  
	    <button
		  className={`lists-trash-toggle ${panelView === "trash" ? "active" : ""}`}
		  onClick={() => {
			  setPanelView(v => v === "trash" ? "active" : "trash");
			  clearSelection();
		  }}
		>
		  {panelView === "trash" ? "← Back to Lists" : `Trash (${trashedLists.length})`}
	  </button>
		
		{/* Mobile-only Close Button. */}
		<button data-unstyled className="lists-close" onClick={onClose}>
		  Close lists
		</button>
	  </aside>
	);
};

export default ListsPanel;