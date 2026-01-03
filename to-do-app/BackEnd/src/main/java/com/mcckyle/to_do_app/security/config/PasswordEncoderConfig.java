//***************************************************************************************
//
//     Filename: PasswordEncoderConfig.java
//     Author: Kyle McColgan
//     Date: 1 January 2026
//     Description: This file implements a custom PasswordEncoder configuration.
//
//***************************************************************************************

package com.mcckyle.to_do_app.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

//***************************************************************************************

@Configuration
public class PasswordEncoderConfig
{
    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }
}

//***************************************************************************************
