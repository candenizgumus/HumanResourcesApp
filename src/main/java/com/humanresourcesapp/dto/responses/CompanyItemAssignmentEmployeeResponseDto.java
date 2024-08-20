package com.humanresourcesapp.dto.responses;

import com.humanresourcesapp.entities.enums.EStatus;

import java.time.LocalDate;

public record CompanyItemAssignmentEmployeeResponseDto(
        Long id,
        String companyItemName,
        String serialNumber,
        LocalDate assignDate,
        EStatus status) {
}
