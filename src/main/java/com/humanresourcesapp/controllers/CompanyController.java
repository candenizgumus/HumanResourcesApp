package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.CompanySaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.services.CompanyService;
import com.humanresourcesapp.views.VwGetCompanyLogos;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;
@RequestMapping(ROOT+COMPANY)
@RequiredArgsConstructor
@RestController
@CrossOrigin("*")
public class CompanyController
{
    private final CompanyService companyService;

    @PostMapping(SAVE)
    public ResponseEntity<Company> save(@RequestBody CompanySaveRequestDto dto)
    {
        return ResponseEntity.ok(companyService.save(dto));
    }

    @GetMapping(GET_ALL_COMPANY_LOGOS)
    public ResponseEntity<List<VwGetCompanyLogos>> getAll()
    {
        return ResponseEntity.ok(companyService.getAll());
    }


    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<List<Company>> getAll(@RequestBody PageRequestDto dto)
    {
        return ResponseEntity.ok(companyService.getAllByPage(dto));
    }

    @PostMapping(UPDATE)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Company> update(@RequestBody CompanySaveRequestDto dto)
    {
        System.out.println(dto);
        return ResponseEntity.ok(companyService.update(dto));
    }
}
