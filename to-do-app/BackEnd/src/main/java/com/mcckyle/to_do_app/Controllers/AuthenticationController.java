//***************************************************************************************
//
//   Filename: AuthenticationController.java
//   Author: Kyle McColgan
//   Date: 2 January 2026
//   Description: This file provides register and login functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Controllers;

import com.mcckyle.to_do_app.payload.*;
import com.mcckyle.to_do_app.security.UserDetailsImpl;
import com.mcckyle.to_do_app.security.UserDetailsServiceImpl;
import com.mcckyle.to_do_app.security.jwt.JwtUtils;
import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.Services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

//***************************************************************************************

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController
{
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDTO userRegistrationDTO, HttpServletResponse response)
    {
        try
        {
            //Register the user using UserService with the new DTO.
            User registeredUser = userService.registerUser(userRegistrationDTO);

            //Generate the access token immediately.
            String accessToken = jwtUtils.generateJwtToken(
                    registeredUser.getId(),
                    registeredUser.getUsername(),
                    registeredUser.getRoles().stream()
                            .map(role -> new SimpleGrantedAuthority(role.getName()))
                            .collect(Collectors.toSet())
            );

            String refreshToken = jwtUtils.generateRefreshToken(registeredUser.getId());

            //Create and return the response.
            ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .secure(false) //turn off for localhost.
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60) //One week.
                    .sameSite("Lax") //Change from "Strict" for localhost.
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());
            response.addHeader("Access-Control-Expose-Headers", "Set-Cookie");

            return ResponseEntity.ok(Map.of(
                    "accessToken", accessToken,
                    "username", registeredUser.getUsername(),
                    "email", registeredUser.getEmail()
            ));
        }
        catch (RuntimeException e)
        {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody UserAuthenticationDTO authenticationDTO, HttpServletResponse response)
    {
        //Authenticate the User using the provided credentials from DTO.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationDTO.getEmail(),
                        authenticationDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Generate the JWT token with roles.
        String accessToken = jwtUtils.generateJwtToken(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getAuthorities()
        );

        String refreshToken = jwtUtils.generateRefreshToken(userDetails.getId());

        // Create and return the response.
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(false) //turn off for localhost.
                .path("/")
                .maxAge(7 * 24 * 60 * 60) //One week.
                .sameSite("Lax") //Change from "Strict" for localhost.
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        response.addHeader("Access-Control-Expose-Headers", "Set-Cookie");

        return ResponseEntity.ok(Map.of(
                "accessToken", accessToken,
                "username", userDetails.getUsername(),
                "email", userDetails.getEmail()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response)
    {
        // Create and return the response.
        ResponseCookie clearCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0) //Expires immediately.
                .build();

        response.addHeader("Set-Cookie", clearCookie.toString());
        response.addHeader("Access-Control-Expose-Headers", "Set-Cookie");

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader)
    {
        try
        {
            // Expect "Bearer <token>".
            if ( (authHeader == null) || (!authHeader.startsWith("Bearer ")) )
            {
                return ResponseEntity.badRequest().body(Map.of("valid", false, "error", "Missing or invalid Authorization header."));
            }

            String token = authHeader.substring(7);

            if ( ! jwtUtils.validateJwtToken(token))
            {
                return ResponseEntity.status(401).body(Map.of("valid", false, "error", "Invalid or expired token."));
            }

            // Extract userId from valid JWT instead of the username.
            Integer userId = jwtUtils.getUserIdFromJwtToken(token);

            if (userId == null)
            {
                return ResponseEntity.status(401)
                        .body(Map.of("valid", false, "error", "Invalid token: userId missing."));
            }

            // Verify user still exists in DB.
            boolean userExists = userService.findById(userId).isPresent();
            if ( ! userExists)
            {
                return ResponseEntity.status(404).body(Map.of("valid", false, "error", "User not found."));
            }

            return ResponseEntity.ok(Map.of("valid", true, "userId", userId));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body(Map.of("valid", false, "error", "Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response)
    {
        Cookie[] cookies = request.getCookies();

        if (cookies == null)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String refreshToken = Arrays.stream(cookies)
                .filter(c -> c.getName().equals("refresh_token"))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if ( (refreshToken == null) || ( ! jwtUtils.validateJwtToken(refreshToken)) )
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer userId = jwtUtils.getUserIdFromJwtToken(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserById(userId);

        String newAccessToken = jwtUtils.generateJwtToken(
                userId,
                userDetails.getUsername(),
                userDetails.getAuthorities()
        );

        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication)
    {
        if ( (authentication == null) || (authentication instanceof AnonymousAuthenticationToken))
        {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", userDetails.getId());
        userData.put("username", userDetails.getUsername());
        userData.put("email", userDetails.getEmail());
        userData.put("bio", userDetails.getBio());
        userData.put("roles", userDetails.getAuthorities());

        return ResponseEntity.ok(userData);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(Authentication authentication, @RequestBody Map<String, String> request)
    {
        try
        {
            if ( (authentication == null) || ( ! authentication.isAuthenticated()) )
            {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            String newPassword = request.get("newPassword");
            if ( (newPassword == null) || (newPassword.isBlank()) )
            {
                return ResponseEntity.badRequest().body(Map.of("error", "Password cannot be empty."));
            }

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            userService.updatePassword(userDetails.getId(), newPassword);

            return ResponseEntity.ok(Map.of("message", "Password updated successfully!"));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(Authentication authentication)
    {
        try
        {
            if ( (authentication == null) || ( ! authentication.isAuthenticated()) )
            {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            userService.deleteUserAccount(userDetails.getId());

            return ResponseEntity.ok(Map.of("message", "Account deleted successfully."));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }
}

//***************************************************************************************