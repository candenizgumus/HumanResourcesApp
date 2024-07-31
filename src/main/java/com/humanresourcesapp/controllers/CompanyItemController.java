package com.humanresourcesapp.controllers;


import com.humanresourcesapp.dto.requests.CompanyItemSaveRequestDto;
import com.humanresourcesapp.entities.CompanyItem;
import com.humanresourcesapp.services.CompanyItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequestMapping(COMPANY_ITEM)
@RequiredArgsConstructor
public class CompanyItemController {

    private final CompanyItemService companyItemService;

    @PostMapping(SAVE)
    public ResponseEntity<CompanyItem> save(@RequestBody CompanyItemSaveRequestDto dto) {
        return ResponseEntity.ok(companyItemService.save(dto));
    }


    @GetMapping(GET_ALL)
    public List<CompanyItem> findAll() {
        return companyItemService.findAll();
    }

}
