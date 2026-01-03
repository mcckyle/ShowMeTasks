//***************************************************************************************
//
//     Filename: CorsConfig.java
//     Author: Kyle McColgan
//     Date: 1 January 2026
//     Description: This file implements a custom CORS config bean for security.
//
//***************************************************************************************

package com.mcckyle.to_do_app.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

//***************************************************************************************

@Configuration
public class CorsConfig
{
    @Bean
    public CorsConfigurationSource corsConfigurationSource()
    {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "https://todo-backend-vnla.onrender.com" //Replace with real URL.
        ));
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        corsConfig.setExposedHeaders(List.of(
                "Set-Cookie",
                "Authorization",
                "Content-Type"
        ));
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }
}

//***************************************************************************************
