//***************************************************************************************
//
//   Filename: TaskCreateRequest.java
//   Author: Kyle McColgan
//   Date: 08 December 2024
//   Description: This class handles incoming JSON data from the frontend.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

//***************************************************************************************

public class TaskCreateRequest
{
    private Integer taskListId;
    private String description;

    // Getters and setters
    public Integer getTaskListId()
    {
        return taskListId;
    }

    public void setTaskListId(Integer taskListId)
    {
        this.taskListId = taskListId;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }
}

//***************************************************************************************
