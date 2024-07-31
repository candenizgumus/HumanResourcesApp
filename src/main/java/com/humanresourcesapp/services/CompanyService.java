package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.CompanySaveRequestDto;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.repositories.CompanyRepository;
import com.humanresourcesapp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService
{
    private final CompanyRepository companyRepository;

    public Company save(CompanySaveRequestDto dto)
    {
        return companyRepository.save(Company.builder().name(dto.name()).logo(dto.logo()).build());
    }

    public Optional<Company> findById(Long id)
    {
        return companyRepository.findById(id);
    }

    public List<Company> getAll() {
        return companyRepository.findAll();
    }
}
