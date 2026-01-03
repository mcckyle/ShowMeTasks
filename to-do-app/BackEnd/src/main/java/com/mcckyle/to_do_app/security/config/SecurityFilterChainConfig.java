//***************************************************************************************
//
//     Filename: SecurityFilterChainConfig.java
//     Author: Kyle McColgan
//     Date: 2 January 2026
//     Description: This file implements a custom Security FilterChain configuration.
//
//***************************************************************************************

package com.mcckyle.to_do_app.security.config;

import com.mcckyle.to_do_app.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

//***************************************************************************************

@Configuration
public class SecurityFilterChainConfig
{
    @Value("${app.security.force-https:false}")
    private boolean forceHttps;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtAuthenticationFilter jwtAuthenticationFilter,
                                                   CorsConfigurationSource corsConfigurationSource) throws Exception
    {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/signin",
                                         "/api/auth/register",
                                         "/api/auth/refresh",
                                         "/api/auth/validate",
                                         "/api/auth/logout").permitAll()
                        .requestMatchers("/api/auth/me").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) //Add the JWT Filter.
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, exAuth) -> {
                            res.sendError(401, "Unauthorized");
                        })
                        .accessDeniedHandler((req, res, exAccess) -> {
                            res.sendError(403, "Forbidden");
                        })
                )
                //Security Headers.
                .headers(headers -> headers
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000) //One year.
                        )
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("default-src 'self'; " +
                                        "script-src 'self'; " +
                                        "style-src 'self' 'unsafe-inline'; " +
                                        "img-src 'self' data:;"
                                )
                        )
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                        .addHeaderWriter((request, response) ->
                                response.setHeader("Referrer-Policy", "no-referrer-when-downgrade")
                        )
                        .cacheControl(cache -> {}) //Defaults to no-cache for sensitive responses.
                );

        return http.build();
    }
}

//***************************************************************************************
