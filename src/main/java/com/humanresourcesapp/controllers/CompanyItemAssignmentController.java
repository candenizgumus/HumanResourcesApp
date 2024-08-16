package com.humanresourcesapp.controllers;

import com.humanresourcesapp.services.CompanyItemAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT + COMPANY_ITEM_ASSIGNMENT)
public class CompanyItemAssignmentController {
    private final CompanyItemAssignmentService companyItemAssignmentService;
}
