package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EPosition;

import java.time.LocalDate;

public record UpdateUserRequestDto(
    String name,
    String surname,
    String phone,
    String title,
    LocalDate birthDate,
    EPosition position,
    String location)
{
}
