package com.humanresourcesapp.dto.requests;

public record DeactivateAccountRequestDto(String password, Boolean deactivateAll)
{
}
