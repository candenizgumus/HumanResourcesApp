package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EPosition;

import java.time.LocalDate;

public record AddEmployeeToManagerRequestDto(String email,
                                             String name,
                                             String surname,
                                             String phone,
                                             LocalDate birthDate,
                                             LocalDate hireDate,
                                             EPosition ePosition)
{
}
