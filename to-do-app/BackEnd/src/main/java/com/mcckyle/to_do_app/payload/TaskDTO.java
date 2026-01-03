//***************************************************************************************
//
//     Filename: TaskDTO.java
//     Author: Kyle McColgan
//     Date: 12 December 2024
//     Description: This file controls the ToDoObj fields returned by server responses.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

import com.mcckyle.to_do_app.Models.ToDoObj;

//***************************************************************************************

public class TaskDTO
{
    private Integer id;
    private String title;
    private boolean completed;

    public TaskDTO(ToDoObj task)
    {
        this.id = task.getId();
        this.title = task.getDescription();
        this.completed = task.getCompleted();
    }

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}

//***************************************************************************************
