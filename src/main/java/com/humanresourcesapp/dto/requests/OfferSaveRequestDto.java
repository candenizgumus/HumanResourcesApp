package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EUserType;

public record OfferSaveRequestDto(
        String name,
        String surname,
        String email,
        String phone,
        String companyName,
        String title,
        String numberOfEmployees


)
{
}
