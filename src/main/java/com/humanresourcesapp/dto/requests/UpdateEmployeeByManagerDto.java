package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EPosition;

import java.time.LocalDate;

public record UpdateEmployeeByManagerDto(
        Long employeeId,
        String name,
        String surname,
        String phone,
        String title,
        LocalDate birthDate,
        LocalDate hireDate,
        EPosition position,
        Long employeeTypeDefinitionId,
        String location
)
{
}
