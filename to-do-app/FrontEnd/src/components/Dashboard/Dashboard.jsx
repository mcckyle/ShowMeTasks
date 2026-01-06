//****************************************************************************************
// Filename: Dashboard.jsx
// Date: 4 January 2026
// Author: Kyle McColgan
// Description: This file contains the Dashboard React component for ShowMeTasks.
//****************************************************************************************

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import TaskListSidebar from "../TaskListSideBar/TaskListSidebar.jsx";
import TaskListView from "../TaskListView/TaskListView.jsx";

import "./Dashboard.css";

const Dashboard = () => {
	const { accessToken, user } = useContext(AuthContext);
	const [taskLists, setTaskLists] = useState([]);
	const [selectedList, setSelectedList] = useState(null);
	const [loading, setLoading] = useState(true);
	
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
	  <section className="dashboard-shell">
	    <aside className="dashboard-sidebar">
			<TaskListSidebar
			  user={user}
			  taskLists={taskLists}
			  selectedList={selectedList}
			  onSelect={setSelectedList}
			  onListCreated={handleListCreated}
			/>
		</aside>
		
		<main className="dashboard-main">
		  <div className="dashboard-canvas">
		    {loading && (
		      <div className="dashboard-state">
			    Loading your workspace...
			  </div>
		    )} 
		  
		    { ! loading && selectedList && (
		      <TaskListView selectedList={selectedList} />
		    )}
		  
		    { ! loading && ! selectedList && (
		      <div className="dashboard-state">
			    Create your first task list to begin.
			  </div>
		    )}
		  </div>
		</main>
	  </section>
	);
};

export default Dashboard;