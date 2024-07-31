package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.CompanySaveRequestDto;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.services.CompanyService;
import com.humanresourcesapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @GetMapping(GET_ALL)
    public ResponseEntity<List<Company>> getAll()
    {
        return ResponseEntity.ok(companyService.getAll());
    }
}
