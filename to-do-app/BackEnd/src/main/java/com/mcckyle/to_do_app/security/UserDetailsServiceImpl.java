//***************************************************************************************
//
//     Filename: UserDetailsServiceImpl.java
//     Author: Kyle McColgan
//     Date: 2 January 2026
//     Description: This file contains database functionality for users.
//
//***************************************************************************************

package com.mcckyle.to_do_app.security;

import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.Services.UserRetrievalHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.stream.Collectors;

//***************************************************************************************

@Service
public class UserDetailsServiceImpl implements UserDetailsService
{
    private final UserRetrievalHelper userRetrievalHelper;

    @Autowired
    public UserDetailsServiceImpl(UserRetrievalHelper userRetrievalHelper)
    {
        this.userRetrievalHelper = userRetrievalHelper;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException
    {
        //Need to change the parameter to email in gift planner backend also...
        //Authenticate with email to match AuthenticationController.authenticateUser()...
        User user = userRetrievalHelper.findByEmail(email) //Authenticate with email...
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email));

        return buildUserDetails(user);
    }

    public UserDetails loadUserById(Integer id) throws UsernameNotFoundException
    {
        User user = userRetrievalHelper.loadUserById(id);

        if (user == null)
        {
            throw new UsernameNotFoundException("User not found with ID: " + id);
        }
        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(User user)
    {
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
}

//***************************************************************************************
