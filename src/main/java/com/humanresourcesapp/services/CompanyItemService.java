package com.humanresourcesapp.services;


import com.humanresourcesapp.entities.CompanyItem;
import com.humanresourcesapp.repositories.CompanyItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CompanyItemService {

    private final CompanyItemRepository companyItemRepository;

    public CompanyItem save(CompanyItem companyItem) {
        return companyItemRepository.save(companyItem);
    }

    public List<CompanyItem> findAll() {
        return companyItemRepository.findAll();
    }

}
