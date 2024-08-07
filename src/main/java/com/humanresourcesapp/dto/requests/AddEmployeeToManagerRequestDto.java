package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EEmployeeType;
import com.humanresourcesapp.entities.enums.EPosition;

import java.time.LocalDate;

public record AddEmployeeToManagerRequestDto(String email,
                                             String name,
                                             String surname,
                                             String phone,
                                             String title,
                                             String location,
                                             LocalDate birthDate,
                                             LocalDate hireDate,
                                             EPosition ePosition,
                                             EEmployeeType eEmployeeType


)
{
}
