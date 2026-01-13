//****************************************************************************************
// Filename: Dashboard.jsx
// Date: 11 January 2026
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
	
	useEffect(() => {
		if ( ! accessToken)
		{
			return;
		}
		
		const fetchLists = async () => {
			try
			{
				const result = await fetch("http://localhost:8080/api/todos/list", {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				
				if (result.ok)
				{
					const data = await result.json();
					setTaskLists(data);
					setSelectedList(data[0] || null);
				}
			}
			catch (error)
			{
				console.error("Error fetching lists: ", error);
			}
			finally
			{
				setLoading(false);
			}
		};
		fetchLists();
	}, [accessToken]);
	
	const handleAddTask = async (text) => {
		if ( ( ! selectedList) || ( ! accessToken))
		{
			return;
		}
		
		try
		{
			const result = await fetch("http://localhost:8080/api/todos/create", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ taskListId: selectedList.id, description: text }),
			});
			
			if ( ! result.ok)
			{
				throw new Error("Failed to add task.");
			}
			
			const newTask = await result.json();
			
			//Update selectedList locally...
			setSelectedList((prev) => ({
				...prev,
				tasks: [...(prev.tasks || []), newTask],
			}));
		}
		catch (error)
		{
			console.error("Error adding task: ", error);
		}
	};
	
	const handleListCreated = (newList) => {
		setTaskLists((prev) => [...prev, newList]);
		setSelectedList(newList);
	};
	
	return (
	  <DashboardLayout
	    header={
			<WorkspaceHeader
			  list={selectedList}
			  onOpenLists={() => setListsOpen(true)}
			/>
		}
		content={
			<WorkspaceContent>
			  {loading && <div className="dashboard-state">Loading...</div>} 
			  { ! loading && selectedList && (
			    <TaskListView selectedList={selectedList} />
			  )}
			  { ! loading && ! selectedList && (
			    <div className="dashboard-state">
				  Create your first task list to begin.
			    </div>
			  )}
			</WorkspaceContent>
		}
		composer={
			selectedList && (
			  <TaskComposer
			    onAdd={handleAddTask}
				disabled={ ! selectedList}
			  />
			)
		}
		panel={
			<ListsPanel
			  open={listsOpen}
			  lists={taskLists}
			  selected={selectedList}
			  onSelect={setSelectedList}
			  onClose={() => setListsOpen(false)}
			/>
		}
	  />
	);
};

export default Dashboard;