//****************************************************************************************
// Filename: ToDoItem.jsx
// Date: 02 November 2025
// Author: Kyle McColgan
// Description: This file contains the React ToDoItem component for ShowMeTasks.
//****************************************************************************************

import React from "react";
import { ListItem, ListItemText, IconButton, Tooltip, Zoom } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ToDoItem.css"; //Styles file...

const ToDoItem = ({ todo, onDelete }) => {
    if ( (!todo) || (!todo.description) )
	{
        return null; // If no todo or description, don't render anything.
    }

    return (
	  <Zoom in>
        <ListItem className="todo-item" divider>
            <ListItemText 
                primaryTypographyProps={{ className="todo-text" }}
                primary={todo.description} // Only render the description here
                data-number={todo.number} // Use the data-number attribute to pass the number
            />
			<Tooltip title="Delete task" arrow>
				<IconButton 
					className="delete-button" 
					edge="end" 
					onClick={() => onDelete(todo.id)}
				>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
        </ListItem>
	</Zoom>
    );
};

export default ToDoItem;