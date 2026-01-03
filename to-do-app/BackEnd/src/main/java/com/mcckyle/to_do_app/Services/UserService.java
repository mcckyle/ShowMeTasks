//***************************************************************************************
//
//     Filename: UserService.java
//     Author: Kyle McColgan
//     Date: 1 January 2026
//     Description: This file provides abstracted registration functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Services;

import com.mcckyle.to_do_app.Data.RoleRepository;
import com.mcckyle.to_do_app.Data.UserRepository;
import com.mcckyle.to_do_app.Models.Role;
import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.payload.UserRegistrationDTO;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

//***************************************************************************************

@Service
public class UserService implements UserRetrievalService
{
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(UserRegistrationDTO registrationDTO)
    {
        //Check for existing username or email.
        if (userRepository.existsByUsername(registrationDTO.getUsername()))
        {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(registrationDTO.getEmail()))
        {
            throw new RuntimeException("Error: Email is already in use!");
        }

        //Create the new user.
        User user = new User(
                registrationDTO.getUsername(),
                registrationDTO.getEmail(),
                passwordEncoder.encode(registrationDTO.getPassword())
        );

        //Assign roles - by default, every user gets "ROLE_USER".
        Role userRole = roleRepository.findByName("ROLE_USER");
        if (userRole == null)
        {
            //If "ROLE_USER" doesn't exist, create it.
            userRole = new Role("ROLE_USER");
            roleRepository.save(userRole);
        }

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    @Transactional
    @PostConstruct
    public void initRoles()
    {
        //Check if roles are already in the database.
        if (roleRepository.count() == 0)
        {
            //Creating default roles if not present.
            Role roleUser = new Role("ROLE_USER");
            Role roleAdmin = new Role("ROLE_ADMIN");
            roleRepository.save(roleUser);
            roleRepository.save(roleAdmin);
        }
    }

    public boolean userExists(Integer userId)
    {
        return userRepository.existsById(userId);
    }

    public void updatePassword(Integer userId, String newPassword)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        String hashed = passwordEncoder.encode(newPassword);
        user.setPassword(hashed);

        userRepository.save(user);
    }

    public void deleteUserAccount(Integer userId)
    {
        if ( ! userRepository.existsById(userId))
        {
            throw new RuntimeException("User does not exist.");
        }

        userRepository.deleteById(userId);
    }
}

//***************************************************************************************