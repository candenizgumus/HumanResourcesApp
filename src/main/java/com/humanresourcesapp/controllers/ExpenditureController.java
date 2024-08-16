package com.humanresourcesapp.controllers;

import static com.humanresourcesapp.constants.Endpoints.*;

import com.humanresourcesapp.dto.requests.DeleteExpenditureRequestDto;
import com.humanresourcesapp.dto.requests.ExpenditureDownloadRequestDto;
import com.humanresourcesapp.dto.requests.ExpenditureSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.responses.UrlResponseDto;
import com.humanresourcesapp.entities.Expenditure;
import com.humanresourcesapp.services.ExpenditureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<Expenditure> save(@RequestParam("description") String description,
                                            @RequestParam("price") double price,
                                            @Nullable  @RequestParam("files") List<MultipartFile> files){
        ExpenditureSaveRequestDto dto = new ExpenditureSaveRequestDto(description, price, files);
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

    @DeleteMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE','MANAGER')")
    public ResponseEntity<Boolean> delete(Long id){
        return ResponseEntity.ok(expenditureService.delete(id));
    }

    @PostMapping(CANCEL)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE','MANAGER')")
    public ResponseEntity<Boolean> cancel(Long id){
        return ResponseEntity.ok(expenditureService.cancel(id));
    }
}
