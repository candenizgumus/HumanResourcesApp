package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EPosition;

public record AddEmployeeToManagerRequestDto(String email,
                                             String name,
                                             String surname,
                                             String phone,
                                             Long birtDate,
                                             Long hireDate,
                                             EPosition ePosition)
{
}
