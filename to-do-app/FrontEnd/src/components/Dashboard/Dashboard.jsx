//****************************************************************************************
// Filename: Dashboard.jsx
// Date: 19 January 2026
// Author: Kyle McColgan
// Description: This file contains the Dashboard React component for ShowMeTasks.
//****************************************************************************************

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
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
	
	/* Fetch Task Lists. */
	useEffect(() => {
		if ( ! accessToken)
		{
			return;
		}
		
		let isMounted = true;
		
		const fetchLists = async () => {
			try
			{
				const response = await fetch("http://localhost:8080/api/todos/list", {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				
				if ( ! response.ok)
				{
					throw new Error("Failed to fetch lists!");
				}
				
				const data = await response.json();
				
				if (isMounted)
				{
					setTaskLists(data);
					setSelectedList((prev) => prev ?? data[0] ?? null);
				}
			}
			catch (error)
			{
				console.error("Error fetching lists: ", error);
			}
			finally
			{
				if (isMounted)
				{
					setLoading(false);
				}
			}
		};
		fetchLists();
		
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
			const response = await fetch("http://localhost:8080/api/todos", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ taskListId: selectedList.id, description: text }),
			});
			
			if ( ! response.ok)
			{
				throw new Error("Failed to add task!");
			}
			
			const newTask = await response.json();
			
			//Update selectedList locally...
			setSelectedList((prev) => ({
				...prev,
				tasks: [...(prev.tasks ?? []), newTask],
			}));
		}
		catch (error)
		{
			console.error("Error adding task: ", error);
		}
	};
	
	/* Handle Newly Created Task List. */
	const handleListCreated = (newList) => {
		setTaskLists((prev) => [...prev, newList]);
		setSelectedList(newList);
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
			  <div className="dashboard-state">
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
			/>
		}
	  />
	);
};

export default Dashboard;