//***************************************************************************************
//
//     Filename: JwtAuthenticationFilter.java
//     Author: Kyle McColgan
//     Date: 2 January 2026
//     Description: This file provides the auth token validation implementation.
//
//***************************************************************************************

package com.mcckyle.to_do_app.security;

import com.mcckyle.to_do_app.security.jwt.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

//***************************************************************************************

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter
{
    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    public JwtAuthenticationFilter(JwtUtils jwtUtils, UserDetailsServiceImpl userDetailsService)
    {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        //Skip only register / signin / refresh endpoints.
        return path.equals("/api/auth/signin")
                || path.equals("/api/auth/register")
                || path.equals("/api/auth/refresh")
                || path.equals("/api/auth/logout");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException
    {
        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization header: " + authHeader);

        if ( (authHeader != null) && (authHeader.startsWith("Bearer ")) )
        {
            String jwt = authHeader.substring(7); // Remove the "Bearer " prefix.
            System.out.println("JWT received: " + jwt);
            System.out.println("JWT valid? " + jwtUtils.validateJwtToken(jwt));

            if (jwtUtils.validateJwtToken(jwt))
            {
                Integer userId = jwtUtils.getUserIdFromJwtToken(jwt);
                //System.out.println("Token validated, userId: " + userId);

                if ( (userId != null) && ( SecurityContextHolder.getContext().getAuthentication() == null) )
                {
                    try
                    {
                        // Use UserDetailsService to load user details
                        UserDetails userDetails = userDetailsService.loadUserById(userId);

                        // Create authentication token and set it in the context
                        UsernamePasswordAuthenticationToken token =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities());

                        SecurityContextHolder.getContext().setAuthentication(token);
                    }
                    catch (org.springframework.security.core.userdetails.UsernameNotFoundException e)
                    {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found. Please log in again.");
                        return; //Stop further filter processing.
                    }
                }
            }
            else
            {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access token is invalid or expired.");
                return;
            }
        }

        //Continue filter chain...
        filterChain.doFilter(request, response);
    }
}

//***************************************************************************************