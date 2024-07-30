package com.humanresourcesapp.controllers;


import com.humanresourcesapp.entities.CompanyItem;
import com.humanresourcesapp.services.CompanyItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequestMapping(COMPANY_ITEM)
@RequiredArgsConstructor
public class CompanyItemController {

    private final CompanyItemService companyItemService;

    @PostMapping(SAVE)
    public CompanyItem save(@RequestBody CompanyItem companyItem) {
        return companyItemService.save(companyItem);
    }

    @GetMapping(GET_ALL)
    public List<CompanyItem> findAll() {
        return companyItemService.findAll();
    }

}
