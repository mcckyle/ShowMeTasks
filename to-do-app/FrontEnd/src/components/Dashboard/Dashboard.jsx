//****************************************************************************************
// Filename: Dashboard.jsx
// Date: 30 January 2026
// Author: Kyle McColgan
// Description: This file contains the Dashboard React component for ShowMeTasks.
//****************************************************************************************

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getLists, updateListDeleted, deleteList, createList } from "../../services/ListService";
import { createTask } from "../../services/TaskService";
import DashboardLayout from "./DashboardLayout/DashboardLayout.jsx";
import WorkspaceHeader from "./WorkspaceHeader/WorkspaceHeader.jsx";
import WorkspaceContent from "./WorkspaceContent/WorkspaceContent.jsx";
import TaskComposer from "./TaskComposer/TaskComposer.jsx";
import ListsPanel from "./ListsPanel/ListsPanel.jsx";
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
	
	const activeLists = taskLists.filter((l) => ! l.deleted);
	const trashedLists = taskLists.filter((l) => l.deleted);
	
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
	
	/* Create first list CTA (used in empty state). */
	const handleCreateFirstList = async () => {
		if ( ! accessToken)
		{
			return;
		}
		
		try
		{
			const newList = await createList({ name: "My First List" }, accessToken);
			setTaskLists((prev) => [...prev, newList]);
			setSelectedList(newList);
		}
		catch (error)
		{
			console.error("Failed to create list: ", error);
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
	
	//Dedicated single-list soft delete handler for the TaskListView.
	const handleSoftDeleteList = async (id) => {
		
		if ( ! accessToken)
		{
			return;
		}
		
		//Optimistic UI updates...
		setTaskLists(prev =>
		  prev.map(list =>
			  list.id === id ? { ...list, deleted: true } : list
		  )
		);
		
		if ( (selectedList?.id) === (id) )
		{
			setSelectedList(null);
		}
		
		try
		{
			await updateListDeleted(id, true, accessToken);
		}
		catch (error)
		{
			console.error("Soft delete failed:", error);
			
			//Refetch to recover...
			const lists = await getLists(accessToken);
			setTaskLists(lists);
		}
	};
	
	const onSoftDeleteSelected = async () => {
		
		if ( ( ! accessToken) || (selectedIds.size === 0) )
		{
			return;
		}
		
		const ids = Array.from(selectedIds);
		
		//Optimistic UI updates...
		setTaskLists(prev =>
		  prev.map(list =>
		    ids.includes(list.id)
			  ? { ...list, deleted: true }
			  : list
		  )
		);
		
		if ( (selectedList) && (ids.includes(selectedList.id)) )
		{
			setSelectedList(null);
		}
		
		clearSelection();
		
		try
		{
			await Promise.all(ids.map(id => updateListDeleted(id, true, accessToken)));
		}
		catch (error)
		{
			console.error("Soft delete failed:", error);
			
			//Refetch to recover...
			const lists = await getLists(accessToken);
			setTaskLists(lists);
		}
	};
	
	const permanentlyDeleteList = async (id) => {
		setTaskLists((prev) => prev.filter(l => l.id !== id));
		await deleteList(id, accessToken);
	};
	
	const restoreList = async (id) => {
		setTaskLists((prev) =>
		  prev.map((list) =>
		    list.id === id ? { ...list, deleted: false } : list
		  )
		);
		
		await updateListDeleted(id, false, accessToken);
	};
	
	const renderContent = () => {
		if (loading)
		{
			//Lightweight skeleton placeholders...
			return (
			  <div className="dashboard-state" role="status" aria-live="polite">
				<div className="skeleton-row skeleton-title" />
				<div className="skeleton-gird">
				  <div className="skeleton-card" />
				  <div className="skeleton-card" />
				  <div className="skeleton-card" />
				</div>
			  </div>
			);
		}
		
		if ( ! selectedList)
		{
			return (
			  <div className="dashboard-state" role="region" aria-label="Workspace empty state">
				<span className="dashboard-state-title">Your workspace is empty</span>
				<span className="dashboard-state-subtitle">
				  Create your first list to start organizing what matters.
				</span>
				<div className="dashboard-cta-row">
				  <button className="dashboard-cta" onClick={handleCreateFirstList}>
				    Create your first list
				  </button>
				  <button
				    className="dashboard-cta subtle"
					onClick={() => {
						setListsOpen(true);
					}}
				  >
				    Browse lists
				  </button>
			  </div>
			</div>
			);
		}
		
		return <TaskListView selectedList={selectedList} onListDeleted={handleSoftDeleteList} />;
	};
	
	return (
	  <DashboardLayout
	    header={<WorkspaceHeader list={selectedList} onOpenLists={() => setListsOpen(true)} />}
		content={<WorkspaceContent>{renderContent()}</WorkspaceContent>}
		composer={selectedList ? (<TaskComposer onAdd={handleAddTask} />) : null}
		panel={
			<ListsPanel
			  open={listsOpen}
			  lists={activeLists}
			  trashedLists={trashedLists}
			  selected={selectedList}
			  onSelect={setSelectedList}
			  onClose={() => setListsOpen(false)}
			  onCreated={handleListCreated}
			  selectionMode={selectionMode}
			  setSelectionMode={setSelectionMode}
			  selectedIds={selectedIds}
			  toggleSelection={toggleSelection}
			  onDeleteSelected={onSoftDeleteSelected}
			  onRestore={restoreList}
			  onPermanentDelete={permanentlyDeleteList}
			  clearSelection={clearSelection}
			/>
		}
		panelOpen={listsOpen}
	  />
	);
};

export default Dashboard;