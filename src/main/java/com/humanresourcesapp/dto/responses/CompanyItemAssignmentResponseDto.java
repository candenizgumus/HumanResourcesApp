package com.humanresourcesapp.dto.responses;

import com.humanresourcesapp.entities.enums.EStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.time.LocalDate;

public record CompanyItemAssignmentResponseDto(
        Long id,
        String companyItemName,
        String serialNumber,
        String employeeEmail,
        LocalDate assignDate,
        EStatus status,
        String message) {
}
