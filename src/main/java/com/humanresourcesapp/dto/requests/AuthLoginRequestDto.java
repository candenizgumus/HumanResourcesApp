package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EUserType;

public record AuthLoginRequestDto(

                                  String password,
                                  String email,
                                  EUserType userType
)
{
}
