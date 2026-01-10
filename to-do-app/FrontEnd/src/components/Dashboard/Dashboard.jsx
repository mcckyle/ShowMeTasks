//****************************************************************************************
// Filename: Dashboard.jsx
// Date: 6 January 2026
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
import TaskListSidebar from "../TaskListSideBar/TaskListSidebar.jsx";
import TaskListView from "../TaskListView/TaskListView.jsx";

import "./Dashboard.css";

const Dashboard = () => {
	const { accessToken, user } = useContext(AuthContext);
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
			    onAdd={() => {}}
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