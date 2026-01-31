//****************************************************************************************
// Filename: TaskComposer.jsx
// Date: 30 January 2026
// Author: Kyle McColgan
// Description: This file contains the TaskComposer React component for ShowMeTasks.
//****************************************************************************************

import { useState } from "react";
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
	  <input
	    type="text"
	    className="task-composer-input"
	    placeholder="Add a task…"
		value={text}
		disabled={disabled}
		onChange={(e) => setText(e.target.value)}
		onKeyDown={(e) => {
			if (e.key === "Enter") submit();
			if (e.key === "Escape") setText("");
		}}
		aria-label="Task description"
	  />
	  <button
	    className="task-composer-button"
		onClick={submit}
		disabled={disabled || ! text.trim()}
		aria-label="Add task"
	  >
	    Add task
	  </button>
	</section>
  );
};

export default TaskComposer;