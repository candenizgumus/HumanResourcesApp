package com.humanresourcesapp.configs.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig
{
    private final JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception
    {
        httpSecurity
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .csrf(csrf-> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/swagger-ui/**","/v3/api-docs/**").permitAll()
                        .requestMatchers("/company/**").permitAll()
                        .requestMatchers("/user/**").permitAll()
                        .requestMatchers("dev/v1/company/**").permitAll()
                        .requestMatchers("dev/v1/offer/**").permitAll()
                        .requestMatchers("dev/v1/**").permitAll()
                        .requestMatchers("/company/**").permitAll()
                        .requestMatchers("auth/login/**","auth/register/**","auth/registerwithrabbit/**").permitAll()
                        .requestMatchers("auth/activationwithrabbit/**","auth/passwordresetmail/**","auth/changepasswordwithresetcode/**").permitAll()
                        .anyRequest().authenticated());
                //.formLogin(Customizer.withDefaults());


        return httpSecurity.build();
    }
}
