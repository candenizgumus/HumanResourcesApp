package com.humanresourcesapp.dto.responses;

import com.humanresourcesapp.entities.enums.EStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;

public record CompanyItemAssignmentResponseDto(
        Long id,
        String itemName,
        String employeeEmail,
        LocalDate assignDate,
        EStatus status,
        String message) {
}
