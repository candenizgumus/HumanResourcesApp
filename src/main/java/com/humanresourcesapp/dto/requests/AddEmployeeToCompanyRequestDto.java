package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EPosition;

import java.time.LocalDate;

public record AddEmployeeToCompanyRequestDto(Long companyId,
                                             String title,
                                             String email,
                                             String name,
                                             String surname,
                                             String phone,
                                             String location,
                                             LocalDate birthDate,
                                             LocalDate hireDate,
                                             EPosition ePosition,
                                             Long employeeTypeDefinitionId,
                                             Double salary


)
{
}
