//***************************************************************************************
//
//     Filename: UserRetrievalHelper.java
//     Author: Kyle McColgan
//     Date: 1 January 2026
//     Description: This file provides database interaction for loading users.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Services;

import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.Data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.Optional;

//***************************************************************************************

@Component
public class UserRetrievalHelper
{
    private final UserRepository userRepository;

    @Autowired
    public UserRetrievalHelper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User loadUserById(Integer id) throws UsernameNotFoundException {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + id));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}

//***************************************************************************************
