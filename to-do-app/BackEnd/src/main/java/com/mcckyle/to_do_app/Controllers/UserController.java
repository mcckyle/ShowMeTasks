//***************************************************************************************
//
//   Filename: UserController.java
//   Author: Kyle McColgan
//   Date: 1 January 2026
//   Description: This file provides User profile functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Controllers;

import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.security.UserDetailsImpl;
import com.mcckyle.to_do_app.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController
{
    private final UserService userService;

    @Autowired
    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    // --- Get Current User. ---
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails)
    {
        User user = userService.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        return ResponseEntity.ok(user);
    }

    // --- Update User Profile. ---
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, String> updates
    )
    {
        User user = userService.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        updates.forEach((key, value) -> {
            if ( (value == null) || (value.isBlank()) )
            {
                return;
            }

            switch (key) {
                case "username" -> user.setUsername(value);
                case "email" -> user.setEmail(value);
                case "bio" -> user.setBio(value);
            }
        });

        userService.findById(user.getId()); //Ensure persistence.

        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully!",
                "user", user
        ));
    }
}

//***************************************************************************************
