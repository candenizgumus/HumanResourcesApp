package com.humanresourcesapp.dto.requests;

import java.time.LocalDate;

public record UpdateEmployeeByManagerDto(
        Long employeeId,
        String name,
        String surname,
        String phone,
        String title,
        LocalDate birthDate,
        LocalDate hireDate,
        String position,
        String employeeType,
        String location
)
{
}
