//***************************************************************************************
//
//     Filename: UserNotFoundException.java
//     Author: Kyle McColgan
//     Date: 21 November 2024
//     Description: This file implements custom exception handling
//                  to handle the lack of an existing user in the database.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Exceptions;

//***************************************************************************************

public class UserNotFoundException extends RuntimeException
{
    public UserNotFoundException(String message)
    {
        super(message);
    }
}

//***************************************************************************************