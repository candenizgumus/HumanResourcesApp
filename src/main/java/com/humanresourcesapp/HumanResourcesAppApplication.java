package com.humanresourcesapp;

import com.humanresourcesapp.utility.AdminUserGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HumanResourcesAppApplication
{

    public static void main(String[] args)
    {
        SpringApplication.run(HumanResourcesAppApplication.class, args);


    }

}
