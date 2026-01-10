//****************************************************************************************
// Filename: TaskComposer.jsx
// Date: 7 January 2026
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
	onAdd(text);
	setText("");
  };
  
  return (
    <div className="task-composer">
	  <TextField
	    placeholder="Add a task..."
		size="small"
		fullWidth
		value={text}
		onChange={(e) => setText(e.target.value)}
		onKeyDown={(e) => e.key === "Enter" && submit()}
	  />
	  <Button
	    variant="contained"
		onClick={submit}
		disabled={disabled || ! text.trim()}
	  >
	    Add
	  </Button>
	</div>
  );
};

export default TaskComposer;