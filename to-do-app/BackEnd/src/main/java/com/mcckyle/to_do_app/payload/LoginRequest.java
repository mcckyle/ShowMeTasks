//***************************************************************************************
//
//     Filename: LoginRequest.java
//     Author: Kyle McColgan
//     Date: 21 November 2024
//     Description: This file formats all login requests for maintainability.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

//***************************************************************************************

public class LoginRequest
{
    private String username;
    private String password;

    // Getters and Setters
    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }
}

//***************************************************************************************