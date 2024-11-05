package com.example.shopping;

import org.springframework.boot.SpringApplication;


public class ShoppingApplication {
    
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(ShoppingApplication.class);
        System.out.println("Hello World from main class");
        app.setAdditionalProfiles(args.length > 0 ? args[0] : "default");
        app.run(args);
    }

}
