//****************************************************************************************
// Filename: ToDoList.jsx
// Date: 02 November 2025
// Author: Kyle McColgan
// Description: This file contains the React ToDoList component for ShowMeTasks.
//****************************************************************************************

import React from "react";
import { List, Paper, Typography, Fade } from "@mui/material";
import ToDoItem from "./ToDoItem";
import "./ToDoList.css";

const ToDoList = ({ todos, onDelete }) => {
	const isEmpty = todos.length === 0;

    return (
	  <Paper elevation={3} className="todo-list-container">
		  {isEmpty? (
		    <Typography variant="body1" className="empty-message">
			  "No tasks to display. Start by adding a new task!"
			</Typography>
		  ) : (
		    <Fade in>
				<List className="todo-list">
					{todos.map((todo, index) => (
						<ToDoItem
							key={todo.id}
							todo={{ ...todo, number: index + 1 }} // Pass the task number as part of the todo prop.
							onDelete={onDelete}
						/>
					))}
				</List>
			</Fade>
		  )}
		</Paper>
  );
};

export default ToDoList;