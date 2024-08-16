package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EStatus;
public record UpdateUserByAdminRequestDto(
        Long userId,
        String name,
        String surname,
        String phone,
        EStatus status)
{
}
