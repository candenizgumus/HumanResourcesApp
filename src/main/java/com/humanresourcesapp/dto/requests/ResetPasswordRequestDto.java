package com.humanresourcesapp.dto.requests;

public record ResetPasswordRequestDto(String token, String newPassword) {
}
