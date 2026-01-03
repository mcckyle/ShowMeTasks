//***************************************************************************************
//
//     Filename: JwtResponse.java
//     Author: Kyle McColgan
//     Date: 21 November 2024
//     Description: This file provides authentication
//                  and authorization response formatting.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

//***************************************************************************************

public class JwtResponse
{
    private String token;
    private Integer id;
    private String username;
    private String email;
    private List<String> roles;  // List of roles as Strings...

    //Constructor...
    public JwtResponse(String token, Integer id, String username,
                       String email, Collection<? extends GrantedAuthority> authorities)
    {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }

    // Getters and setters...
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public String getToken()
    {
        return token;
    }

    public void setToken(String token)
    {
        this.token = token;
    }

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

    public List<String> getRoles()
    {
        return roles;
    }

    public void setRoles(List<String> roles)
    {
        this.roles = roles;
    }
}

//***************************************************************************************