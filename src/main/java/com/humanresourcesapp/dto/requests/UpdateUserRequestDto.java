package com.humanresourcesapp.dto.requests;

import java.time.LocalDate;

public record UpdateUserRequestDto(
        String name,
        String surname,
        String phone,
        String title,
        LocalDate birthDate,
        String position,
        String location
)
{
}
