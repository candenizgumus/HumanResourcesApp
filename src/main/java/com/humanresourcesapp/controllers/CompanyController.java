package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.services.CompanyService;
import com.humanresourcesapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/company")
@RequiredArgsConstructor
@RestController
public class CompanyController
{
    private final CompanyService companyService;

    @PostMapping("/save")
    public ResponseEntity<Company> save(Company company)
    {
        return ResponseEntity.ok(companyService.save(company));
    }
}
