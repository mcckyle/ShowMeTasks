//****************************************************************************************
// Filename: TaskComposer.jsx
// Date: 23 January 2026
// Author: Kyle McColgan
// Description: This file contains the TaskComposer React component for ShowMeTasks.
//****************************************************************************************

import { useState } from "react";
import { TextField, Button } from "@mui/material";

import "./TaskComposer.css";

const TaskComposer = ({ onAdd, disabled }) => {
  const [text, setText] = useState("");
  
  const submit = () => {
    if ( ! text.trim())
	{
	  return;
	}
	onAdd(text.trim());
	setText("");
  };
  
  return (
    <section
	  className="task-composer"
	  role="region"
	  aria-label="Add a new task"
	>
	  <TextField
	    className="task-composer-input"
	    placeholder="Add a task…"
		size="small"
		fullWidth
		value={text}
		disabled={disabled}
		onChange={(e) => setText(e.target.value)}
		onKeyDown={(e) => {
			if (e.key === "Enter") submit();
			if (e.key === "Escape") setText("");
		}}
		inputProps={{ "aria-label": "Task description", }}
	  />
	  <Button
	    variant="contained"
		size="small"
		onClick={submit}
		disabled={disabled || ! text.trim()}
		aria-label="Add task"
	  >
	    Add
	  </Button>
	</section>
  );
};

export default TaskComposer;