package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EPosition;
import com.humanresourcesapp.entities.enums.EStatus;

import java.time.LocalDate;

public record UpdateUserByAdminRequestDto(
        Long userId,
        String name,
        String surname,
        String phone,
        EStatus status)
{
}
