//****************************************************************************************
// Filename: Dashboard.jsx
// Date: 23 January 2026
// Author: Kyle McColgan
// Description: This file contains the Dashboard React component for ShowMeTasks.
//****************************************************************************************

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getLists, deleteList } from "../../services/ListService";
import { createTask } from "../../services/TaskService";
import DashboardLayout from "./DashboardLayout";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceContent from "./WorkspaceContent";
import TaskComposer from "./TaskComposer";
import ListsPanel from "./ListsPanel";
import TaskListView from "../TaskListView/TaskListView.jsx";

import "./Dashboard.css";

const Dashboard = () => {
	const { accessToken } = useContext(AuthContext);
	const [taskLists, setTaskLists] = useState([]);
	const [selectedList, setSelectedList] = useState(null);
	const [loading, setLoading] = useState(true);
	const [listsOpen, setListsOpen] = useState(false);
	const [selectionMode, setSelectionMode] = useState(false);
	const [selectedIds, setSelectedIds] = useState(new Set());
	
	/* Fetch Task Lists. */
	useEffect(() => {
		if ( ! accessToken)
		{
			return;
		}
		let isMounted = true;
		
		const loadLists = async () => {
			try
			{
				setLoading(true);
				const lists = await getLists(accessToken);
				
				if ( ! isMounted)
				{
					return;
				}
				
				setTaskLists(lists);
				setSelectedList((prev) => prev ?? lists?.[0] ?? null);
			}
			catch (error)
			{
				console.error("Failed to load task lists:", error);
			}
			finally
			{
				if (isMounted)
				{
					setLoading(false);
				}
			}
		}
		
		loadLists();
		
		return () => {
			isMounted = false;
		};
	}, [accessToken]);
	
	/* Add Task to the Selected List. */
	const handleAddTask = async (text) => {
		if ( ( ! selectedList) || ( ! accessToken))
		{
			return;
		}
		
		try
		{
			const newTask = await createTask(
			    {
					taskListId: selectedList.id,
					description: text,
				},
				accessToken
			);
			
			//Update selectedList locally...
			setSelectedList((prev) => ({
				...prev,
				tasks: [...(prev.tasks ?? []), newTask],
			}));
			
			//Keep lists in sync.
			setTaskLists((prev) =>
			    prev.map((list) =>
				    list.id === selectedList.id
					    ? { ...list, tasks: [...(list.tasks ?? []), newTask] }
						: list
				
				)
			);
		}
		catch (error)
		{
			console.error("Failed to add task: ", error);
		}
	};
	
	/* Handle Newly Created Task List. */
	const handleListCreated = (newList) => {
		setTaskLists((prev) => [...prev, newList]);
		setSelectedList(newList);
	};
	
	/* Bulk delete lists helpers. */
	const toggleSelection = (id) => {
		setSelectedIds(prev => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};
	
	const clearSelection = () => {
		setSelectedIds(new Set());
		setSelectionMode(false);
	};
	
	const onDeleteSelected = async () => {
		if ( ( ! accessToken) || (selectedIds.size === 0))
		{
			return;
		}
		
		const idsToDelete = Array.from(selectedIds);
		
		//Optimistic UI updates...
		setTaskLists(prev =>
		  prev.filter(list => ! selectedIds.has(list.id))
		);
		
		//Clear the currently selected list if it was deleted...
		setSelectedList(prev =>
		  prev && selectedIds.has(prev.id) ? null : prev
		);
		
		clearSelection();
		
		try
		{
			await Promise.all(
			  idsToDelete.map(id => deleteList(id, accessToken))
			);
		}
		catch (error)
		{
			console.error("Failed to delete one or more lists:", error);
			
			//Refetch lists to resync state...
			try
			{
				const lists = await getLists(accessToken);
				setTaskLists(lists);
				setSelectedList(lists?.[0] ?? null);
			}
			catch (reloadError)
			{
				console.error("Failed to reload lists after delete list failure:", reloadError);
			}
		}
	};
	
	const renderContent = () => {
		if (loading)
		{
			return (
			  <div className="dashboard-state" role="status" aria-live="polite">
				<span className="dashboard-state-title">Loading your workspace</span>
				<span className="dashboard-state-subtitle">
				  Just a moment…
				</span>
			  </div>
			);
		}
		
		if ( ! selectedList)
		{
			return (
			  <div className="dashboard-state" role="region" aria-label="Workspace state">
				<span className="dashboard-state-title">Your workspace is empty</span>
				<span className="dashboard-state-subtitle">
				  Create a task list to start organizing your work.
				</span>
			  </div>
			);
		}
		
		return <TaskListView selectedList={selectedList} />;
	};
	
	return (
	  <DashboardLayout
	    header={
			<WorkspaceHeader
			  list={selectedList}
			  onOpenLists={() => setListsOpen(true)}
			/>
		}
		content={<WorkspaceContent>{renderContent()}</WorkspaceContent>}
		composer={
			selectedList ? (
			  <TaskComposer onAdd={handleAddTask} />
			) : null
		}
		panel={
			<ListsPanel
			  open={listsOpen}
			  lists={taskLists}
			  selected={selectedList}
			  onSelect={setSelectedList}
			  onClose={() => setListsOpen(false)}
			  onCreated={handleListCreated}
			  selectionMode={selectionMode}
			  setSelectionMode={setSelectionMode}
			  selectedIds={selectedIds}
			  toggleSelection={toggleSelection}
			  onDeleteSelected={onDeleteSelected}
			  clearSelection={clearSelection}
			/>
		}
		panelOpen={listsOpen}
	  />
	);
};

export default Dashboard;