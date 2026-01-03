//***************************************************************************************
//
//     Filename: FilterConfig.java
//     Author: Kyle McColgan
//     Date: 1 January 2026
//     Description: This file holds the auth filter configuration.
//
//***************************************************************************************

package com.mcckyle.to_do_app.security.config;

import com.mcckyle.to_do_app.security.JwtAuthenticationFilter;
import com.mcckyle.to_do_app.security.UserDetailsServiceImpl;
import com.mcckyle.to_do_app.security.jwt.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//***************************************************************************************

@Configuration
public class FilterConfig
{
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtils jwtUtils, UserDetailsServiceImpl userDetailsService)
    {
        return new JwtAuthenticationFilter(jwtUtils, userDetailsService);
    }
}

//***************************************************************************************
