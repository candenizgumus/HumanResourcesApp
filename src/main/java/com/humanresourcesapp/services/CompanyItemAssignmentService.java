package com.humanresourcesapp.services;

import com.humanresourcesapp.repositories.CompanyItemAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyItemAssignmentService {
    private final CompanyItemAssignmentRepository companyItemAssignmentRepository;
}
