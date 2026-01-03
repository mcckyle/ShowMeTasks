//***************************************************************************************
//
//     Filename: UserRegistrationDTO.java
//     Author: Kyle McColgan
//     Date: 1 January 2026
//     Description: This file holds User related information in an object.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

//***************************************************************************************

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

//***************************************************************************************

public class UserRegistrationDTO
{
    @NotBlank
    @Size(max = 50)
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, max = 64)
    private String password;

    // Default constructor
    public UserRegistrationDTO() {}

    // Parameterized constructor
    public UserRegistrationDTO(String username, String email, String password)
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
