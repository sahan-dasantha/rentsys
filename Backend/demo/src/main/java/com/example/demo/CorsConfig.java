package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global Cross-Origin Resource Sharing (CORS) Configuration.
 * 
 * Configures network access policies so  React frontend running on Vite
 * (http://localhost:5173) can communicate with this Spring Boot backend (http://localhost:8081).
 */
@Configuration // Marks this class as a Spring configuration class that declares @Bean definitions
public class CorsConfig {

    /**
     * Declares a WebMvcConfigurer Spring Bean to override default CORS policy settings globally.
     * 
     * @return An implementation of WebMvcConfigurer with customized CORS rules.
     */
    @Bean // Registers the returned WebMvcConfigurer object as a bean in the Spring Application Context
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            /**
             * Configures path mappings and cross-origin permissions.
             * 
             * @param registry CORS registry used to define mapping rules.
             */
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Applies CORS rules to ALL API endpoints in the application
                        .allowedOrigins("http://localhost:5173") // Permits requests specifically from  React Vite dev server
                        .allowedMethods("GET","POST","PUT","DELETE") // Allows standard HTTP REST operations
                        .allowedHeaders("*"); // Accepts all incoming request headers (e.g., Content-Type, Authorization)
            }
        };
    }
}