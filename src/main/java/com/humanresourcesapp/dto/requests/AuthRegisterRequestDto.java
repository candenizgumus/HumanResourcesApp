package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EUserType;

public record AuthRegisterRequestDto(String name,

    String password,
    String email,
    EUserType userType
)
{
}
