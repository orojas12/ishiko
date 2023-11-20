package com.ishiko.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorize ->
                authorize.anyRequest().authenticated()
        );
        http.oauth2ResourceServer(resourceServer ->
                resourceServer.jwt(Customizer.withDefaults())
        );
        return http.build();
    }

    @Bean
    public JwtDecoder decoder() {
        return JwtDecoders.fromIssuerLocation("http://localhost:8080");
    }
}

