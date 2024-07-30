package com.humanresourcesapp.controllers;


import com.humanresourcesapp.entities.CompanyItem;
import com.humanresourcesapp.services.CompanyItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/company-item")
@RequiredArgsConstructor
public class CompanyItemController {

    private final CompanyItemService companyItemService;

    @PostMapping("/new")
    public CompanyItem save(@RequestBody CompanyItem companyItem) {
        return companyItemService.save(companyItem);
    }

    @GetMapping
    public List<CompanyItem> findAll() {
        return companyItemService.findAll();
    }

}
