//***************************************************************************************
//
//     Filename: UserDetailsImpl.java
//     Author: Kyle McColgan
//     Date: 1 January 2026
//     Description: This file contains the back end account structure and methods.
//
//***************************************************************************************

package com.mcckyle.to_do_app.security;

import com.mcckyle.to_do_app.Models.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

//***************************************************************************************

public class UserDetailsImpl implements UserDetails
{
    private Integer id;
    private String username;
    private String email;
    private String password;
    private String bio;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Integer id, String username, String email, String password, String bio,
                           Collection<? extends GrantedAuthority> authorities)
    {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user)
    {
        // Map User roles to GrantedAuthorities.
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getBio(),
                authorities
        );
    }

    public Integer getId()
    {
        return id;
    }

    @Override
    public String getUsername()
    {
        return username;
    }

    @Override
    public String getPassword()
    {
        return password;
    }

    public String getEmail()
    {
        return email;
    }

    public String getBio()
    {
        return bio;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities()
    {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired()
    {
        return true;
    }

    @Override
    public boolean isAccountNonLocked()
    {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired()
    {
        return true;
    }

    @Override
    public boolean isEnabled()
    {
        return true;
    }
}

//***************************************************************************************