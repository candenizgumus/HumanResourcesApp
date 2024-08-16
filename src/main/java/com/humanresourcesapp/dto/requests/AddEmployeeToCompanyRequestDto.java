package com.humanresourcesapp.dto.requests;

import jakarta.validation.constraints.Email;

import java.time.LocalDate;

public record AddEmployeeToCompanyRequestDto(Long companyId,
                                             String title,
                                             @Email(message = "Not a valid Email")
                                             String email,
                                             String name,
                                             String surname,
                                             String phone,
                                             String location,
                                             LocalDate birthDate,
                                             LocalDate hireDate,
                                             String position,
                                             String employeeType,
                                             Double salary


)
{
}
