//***************************************************************************************
//
//     Filename: TaskUpdateDTO.java
//     Author: Kyle McColgan
//     Date: 21 January 2026
//     Description: This file contains the payload for updating tasks.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

public class TaskUpdateRequest
{
    private String description;
    private Boolean completed;

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}
