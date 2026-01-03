//***************************************************************************************
//
//     Filename: UserAuthenticationDTO.java
//     Author: Kyle McColgan
//     Date: 1 January 2026
//     Description: This file provides an authentication object representation.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

//***************************************************************************************

public class UserAuthenticationDTO
{
    @Email
    @NotBlank
    @Size(max = 50)
    private String email;

    @NotBlank
    @Size(min = 8, max = 64)
    private String password;

    public UserAuthenticationDTO() {}

    public UserAuthenticationDTO(String email, String password)
    {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

//***************************************************************************************
