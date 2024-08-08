package com.humanresourcesapp.dto.requests;

public record PasswordChangeRequestDto(
        String password,
        String newPassword

)
{
}
