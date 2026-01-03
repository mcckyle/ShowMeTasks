//***************************************************************************************
//
//     Filename: JwtUtils.java
//     Author: Kyle McColgan
//     Date: 2 January 2026
//     Description: This file contains the auth token object definition.
//
//***************************************************************************************

package com.mcckyle.to_do_app.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

//***************************************************************************************

@Component
public class JwtUtils
{
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Integer userId, String username,
                                   Collection<? extends GrantedAuthority> authorities)
    {
        String roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        String jti = UUID.randomUUID().toString();

        return Jwts.builder()
                .setIssuer("to_do_app")
                .setAudience("to_do_app-client")
                .setId(jti)
                .setSubject(String.valueOf(userId))
                .claim("username", username)  // Include userId in the JWT
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(Integer userId)
    {
        return Jwts.builder()
                .setIssuer("to_do_app")
                .setAudience("to_do_app-client")
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 604800000)) //One week.
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS512)
                .compact();
    }

    public Claims getClaimsFromToken(String token)
    {
        try
        {
            return Jwts.parserBuilder()
                    .requireIssuer("to_do_app")
                    .requireAudience("to_do_app-client")
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }
        catch (ExpiredJwtException e)
        {
            System.out.println("JWT token is expired: " + e.getMessage());
        }
        catch (UnsupportedJwtException e)
        {
            System.out.println("JWT token is unsupported: " + e.getMessage());
        }
        catch (MalformedJwtException e)
        {
            System.out.println("Malformed JWT token: " + e.getMessage());
        }
        catch (JwtException | IllegalArgumentException e)
        {
            System.out.println("Invalid JWT token: " + e.getMessage());
        }
        return null;
    }

    public Integer getUserIdFromJwtToken(String token)
    {
        Claims claims = getClaimsFromToken(token);

        if (claims == null)
        {
            return null;
        }

        String sub = claims.getSubject();

        try
        {
            return Integer.valueOf(sub);
        }
        catch (NumberFormatException e)
        {
            return null;
        }
    }

    public String getUserNameFromJwtToken(String token)
    {
        Claims claims = getClaimsFromToken(token);
        return claims != null ? claims.getSubject() : null;
    }

    public boolean validateJwtToken(String authToken)
    {
        try
        {
            Claims claims = getClaimsFromToken(authToken);
            return claims != null && !isTokenExpired(claims);
        }
        catch (Exception e)
        {
            System.out.println("Error during token validation: " + e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(Claims claims)
    {
        return claims.getExpiration().before(new Date());
    }
}

//***************************************************************************************