package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EUserType;
import jakarta.validation.constraints.Email;

public record CreateUserRequestDto (
        @Email(message = "Not a valid Email")
        String email,
        String password,
        EUserType userType
) {

}
