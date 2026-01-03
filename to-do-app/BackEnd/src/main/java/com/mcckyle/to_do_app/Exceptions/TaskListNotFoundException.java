//***************************************************************************************
//
//     Filename: TaskListNotFoundException.java
//     Author: Kyle McColgan
//     Date: 21 November 2024
//     Description: This file implements custom exception handling
//                  to handle empty task lists.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Exceptions;

//***************************************************************************************

public class TaskListNotFoundException extends RuntimeException
{
    public TaskListNotFoundException(String message)
    {
        super(message);
    }
}

//***************************************************************************************
