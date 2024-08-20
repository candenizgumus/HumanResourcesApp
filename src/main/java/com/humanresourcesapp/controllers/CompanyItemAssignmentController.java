package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.CompanyItemAssignmentRequestDto;
import com.humanresourcesapp.dto.requests.EmployeeRejectAssignmentRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.responses.CompanyItemAssignmentEmployeeResponseDto;
import com.humanresourcesapp.dto.responses.CompanyItemAssignmentResponseDto;
import com.humanresourcesapp.dto.responses.ItemAssignmentsOfEmployeeResponseDto;
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

    @PostMapping(GET_ALL_BY_EMPLOYEE)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<List<CompanyItemAssignmentEmployeeResponseDto>> getAllAssignmentsByEmployee() {
        return ResponseEntity.ok(companyItemAssignmentService.getAllAssignmentsByEmployee());
    }

    @PutMapping(APPROVE_ASSIGNMENT + "/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<Boolean> approveAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(companyItemAssignmentService.approveAssignment(id));
    }

    @PutMapping(REJECT_ASSIGNMENT)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<Boolean> rejectAssignment(@RequestBody EmployeeRejectAssignmentRequestDto dto) {
        return ResponseEntity.ok(companyItemAssignmentService.rejectAssignment(dto));
    }

    //@PutMapping(CANCEL_ASSIGNMENT_BY_MANAGER)

    @PostMapping(GET_ASSIGNED_ITEMS_OF_EMPLOYEE)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<List<ItemAssignmentsOfEmployeeResponseDto>> getAssignedItemsOfEmployee() {
        return ResponseEntity.ok(companyItemAssignmentService.getAssignedItemsOfEmployee());
    }

}
