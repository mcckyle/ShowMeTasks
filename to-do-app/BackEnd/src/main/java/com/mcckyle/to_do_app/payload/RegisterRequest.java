//***************************************************************************************
//
//     Filename: RegisterRequest.java
//     Author: Kyle McColgan
//     Date: 21 November 2024
//     Description: This file contains the format for registration requests.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

//***************************************************************************************

public class RegisterRequest
{
    private String username;
    private String email;
    private String password;

    //Default constructor...
    public RegisterRequest()
    {

    }

    //Constructor with parameters...
    public RegisterRequest(String username, String email, String password)
    {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getters and setters
    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
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
