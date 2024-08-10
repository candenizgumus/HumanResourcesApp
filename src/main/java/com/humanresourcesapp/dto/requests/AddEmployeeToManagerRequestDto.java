package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EEmployeeType;
import com.humanresourcesapp.entities.enums.EPosition;

import java.time.LocalDate;

public record AddEmployeeToManagerRequestDto(Long managerId,
                                             String title,
                                             String email,
                                             String name,
                                             String surname,
                                             String phone,
                                             String location,
                                             LocalDate birthDate,
                                             LocalDate hireDate,
                                             EPosition ePosition,
                                             EEmployeeType eEmployeeType,
                                             Double salary


)
{
}
