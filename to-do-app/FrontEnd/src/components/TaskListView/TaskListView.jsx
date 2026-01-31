//****************************************************************************************
// Filename: TaskListView.jsx
// Date: 30 January 2026
// Author: Kyle McColgan
// Description: This file contains the TaskListView React component for ShowMeTasks.
//****************************************************************************************

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateList, deleteList } from "../../services/ListService";
import { getTasks, createTask, updateTask, deleteTask } from "../../services/TaskService";

import "./TaskListView.css";

const TaskListView = ({ selectedList, onListDeleted }) => {
	const { accessToken } = useContext(AuthContext);
	const [tasks, setTasks] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [editingText, setEditingText] = useState("");
	const [editingListName, setEditingListName] = useState(false);
	const [listName, setListName] = useState(selectedList?.name || "");
	const [loading, setLoading] = useState(true);
	
	/* Sync list name on selection changes. */
	useEffect(() => {
		setListName(selectedList?.name || "");
		setEditingListName(false);
	}, [selectedList]);
	
	/* Fetch tasks here, not lists. */
	useEffect(() => {
		if ( ( ! selectedList) || ( ! accessToken) )
		{
			return;
		}
		let isMounted = true;
		
		const loadTasks = async () => {
			try
			{
				setLoading(true);
				const data = await getTasks(selectedList.id, accessToken);
				
				if (isMounted)
				{
					setTasks(data ?? []);
				}
			}
			catch (error)
			{
				console.error("Failed to load tasks:", error);
			}
			finally
			{
				if (isMounted)
				{
					setLoading(false);
				}
			}
		}
		
		loadTasks();
		
		return () => {
			isMounted = false;
		};
	}, [selectedList, accessToken]);
	
	const handleUpdateListName = async () => {
		if ( ! listName.trim())
		{
			return;
		}
		
		try
		{
			await updateList(
			    selectedList.id,
				{ name: listName.trim() },
				accessToken
			);
			
			setEditingListName(false);
		}
		catch (error)
		{
			console.error("Failed to update list name: ", error);
		}
	};
	
	const handleUpdateTask = async (taskId) => {
		const newText = editingText.trim();
		if ( ! newText)
		{
			return;
		}
		
		try
		{
			await updateTask(
			    taskId,
				{ description: newText },
				accessToken
			);
			
			setTasks((prev) =>
				  prev.map((t) => (t.id === taskId ? { ...t, description: newText } : t))
			);
			
			setEditingId(null);
		}
		catch (error)
		{
			console.error("Error updating task: ", error);
		}
	};
	
	const handleDeleteList = async () => {
		const confirmed = window.confirm(
		  "Delete this task list and all its tasks?"
		);
		
		if ( ! confirmed)
		{
			return;
		}
		
		onListDeleted(selectedList.id);
	};
	
	const handleDeleteTask = async (id) => {
		try
		{
			await deleteTask(id, accessToken);
			setTasks((prev) => prev.filter((t) => t.id !== id));
		}
		catch (error)
		{
			console.error("Error deleting task: ", error);
		}
	};
	
	const handleToggleCompleted = async (task) => {
		const nextCompleted = ! task.completed;
		
		//Optimistic UI.
		setTasks((prev) =>
		    prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
		);
		
		try
		{
			await updateTask(
			    task.id,
				{
				  completed: nextCompleted,
				  description: task.description, //Preserve task description...
				},
				accessToken
			);
		}
		catch (error)
		{
			//Roll back if needed...
			setTasks((prev) =>
		        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
			);
			console.error("Failed to toggle task: ", error);
		}
	};
	
	if ( ! selectedList)
	{
		return (
		  <div className="tasklist-placeholder">
		    Select a list to begin.
		  </div>
		);
	}
	
	return (
	  <div className="tasklist-view">
	    {/* Header. */}
		<header className="tasklist-header">
		 <div className="tasklist-header-main">
		 {editingListName ? (
		   <input
		     className="tasklist-input"
		     value={listName}
			 onChange={(e) => setListName(e.target.value)}
			 onBlur={handleUpdateListName}
			 onKeyDown={e => {
				 if (e.key === "Enter") handleUpdateListName();
				 if (e.key === "Escape") {
					 setListName(selectedList.name);
					 setEditingListName(false);
				 }
			 }}
			 autoFocus
			/>
		  ) : (
		  <h2
		    className="tasklist-title"
			onDoubleClick={() => setEditingListName(true)}
			title="Double-click to rename"
		  >
		    {listName}
			{selectedList.isDefault && (
			  <span className="tasklist-default">(default)</span>
			)}
		  </h2>
		 )}
		 
		 <div className="tasklist-count">
		    {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
		  </div>
		</div>
		
		<button
		  className="delete-list-btn"
		  onClick={handleDeleteList}
		  disabled={selectedList.isDefault}
		  title={selectedList.isDefault ? "Cannot delete default list" : "Delete this list"}
		>
		    Delete
		  </button>
	  </header>
		
		{/* Tasks. */}
		<section className="tasklist-content">
		  {loading ? (
		    <div className="tasklist-empty">
			  Loading tasks…
			</div>
		  ) : tasks.length === 0 ? (
		    <div className="tasklist-empty">
			  Add your first task to get started.
			</div>
		  ) : (
		   tasks.map((task) => (
		  <div key={task.id} className={`task-row ${task.completed ? "completed" : ""}`}>
		    <input
			  type="checkbox"
			  className="task-checkbox"
			  checked={Boolean(task.completed)}
			  onChange={() => handleToggleCompleted(task)}
			/>
				{editingId === task.id ? (
				   <input
				     className="task-edit-input"
				     value={editingText}
					 onChange={e => setEditingText(e.target.value)}
					 onKeyDown={e => {
						 if (e.key === "Enter") handleUpdateTask(task.id);
						 if (e.key === "Escape") setEditingId(null);
					 }}
					 autoFocus
				   />
				) : (
			        <span
			          className="task-text"
				      onDoubleClick={() => {
					     setEditingId(task.id);
					     setEditingText(task.description);
				      }}
			        >
			            {task.description}
			        </span>
		        )}
				
				<div className="task-actions">
				  {editingId === task.id ? (
				    <button className="task-save-btn" onClick={() => handleUpdateTask(task.id)}>
			          Save
			        </button>
			      ) : (
				   <button
					 className="task-delete-btn"
					 onClick={() => handleDeleteTask(task.id)}
				   >
					 Delete
				   </button>
			     )}
			  </div>
			</div>
			))
		  )}
		</section>
	</div>
	);
};

export default TaskListView;