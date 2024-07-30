package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.repositories.CompanyRepository;
import com.humanresourcesapp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService
{
    private final CompanyRepository companyRepository;

    public Company save(Company company)
    {
        companyRepository.save(company);
        return company;
    }

    public Optional<Company> findById(Long id)
    {
        return companyRepository.findById(id);
    }
}
