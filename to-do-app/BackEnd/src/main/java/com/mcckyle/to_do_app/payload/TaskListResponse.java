//***************************************************************************************
//
//     Filename: TaskListResponse.java
//     Author: Kyle McColgan
//     Date: 21 November 2024
//     Description: This file contains the layout for the task list responses.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

//***************************************************************************************

public class TaskListResponse
{
    private Integer id;
    private String name;

    //Default constructor...
    public TaskListResponse()
    {

    }

    // Constructor with parameters...
    public TaskListResponse(Integer id, String name)
    {
        this.id = id;
        this.name = name;
    }

    // Getters and Setters
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }
}

//***************************************************************************************