package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.CompanyItemAssignmentRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.responses.CompanyItemAssignmentResponseDto;
import com.humanresourcesapp.entities.CompanyItemAssignment;
import com.humanresourcesapp.services.CompanyItemAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT + COMPANY_ITEM_ASSIGNMENT)
@CrossOrigin("*")
public class CompanyItemAssignmentController {
    private final CompanyItemAssignmentService companyItemAssignmentService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> addAssignment(@RequestBody CompanyItemAssignmentRequestDto dto) {
        return ResponseEntity.ok(companyItemAssignmentService.save(dto));
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<CompanyItemAssignmentResponseDto>> getAllAssignments() {
        return ResponseEntity.ok(companyItemAssignmentService.getAllAssignments());
    }

    @PostMapping(APPROVE_ASSIGNMENT)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<Boolean> approveAssignment(Long id, Long employeeId) {
        return ResponseEntity.ok(companyItemAssignmentService.approveAssignment(id, employeeId));
    }


}
