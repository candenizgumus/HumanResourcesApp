package com.humanresourcesapp.controllers;

import static com.humanresourcesapp.constants.Endpoints.*;

import com.humanresourcesapp.dto.requests.ExpenditureSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Expenditure;
import com.humanresourcesapp.services.ExpenditureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ROOT+EXPENDITURE)
@RequiredArgsConstructor
@CrossOrigin("*")
public class ExpenditureController
{
    private final ExpenditureService expenditureService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<Expenditure> save(@RequestBody ExpenditureSaveRequestDto dto){

        return ResponseEntity.ok(expenditureService.save(dto));
    }

    @PostMapping(SEARCH_BY_EMPLOYEE_ID)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<List<Expenditure>> searchByEmployeeId(@RequestBody PageRequestDto dto){
        return ResponseEntity.ok(expenditureService.searchByEmployeeId(dto));
    }

    @PostMapping(SEARCH_BY_COMPANY_ID)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<Expenditure>> searchByCompanyId(@RequestBody PageRequestDto dto){
        return ResponseEntity.ok(expenditureService.searchByCompanyId(dto));
    }

    @PostMapping(APPROVE_EXPENDITURE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> approveExpenditure(Long id){
        return ResponseEntity.ok(expenditureService.approveExpenditure(id));
    }
}
