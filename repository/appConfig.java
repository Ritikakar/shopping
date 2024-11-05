package com.example.shopping.repository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class appConfig {
    @Bean
    public String someStringBean() {
        return "YourStringValue";
    }
}
