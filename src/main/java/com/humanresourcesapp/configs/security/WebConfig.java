package com.humanresourcesapp.configs.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Kök dizindeki uploads klasörünü statik kaynak olarak sunma
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}