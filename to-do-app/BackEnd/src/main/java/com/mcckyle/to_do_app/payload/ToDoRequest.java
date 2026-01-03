//***************************************************************************************
//
//     Filename: ToDoRequest.java
//     Author: Kyle McColgan
//     Date: 21 November 2024
//     Description: This file contains the structure of task objects.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

//***************************************************************************************

public class ToDoRequest
{
    private String title;
    private String description;

    // Default constructor
    public ToDoRequest()
    {
    }

    // Constructor with parameters
    public ToDoRequest(String title, String description)
    {
        this.title = title;
        this.description = description;
    }

    // Getters and setters
    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
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
