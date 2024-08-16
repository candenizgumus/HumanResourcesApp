package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.ESectors;
import jakarta.validation.constraints.Email;

public record OfferSaveRequestDto(
        String name,
        String surname,
        @Email(message = "Not a valid Email")
        String email,
        String phone,
        String companyName,
        String title,
        String numberOfEmployees,
        ESectors sector


)
{
}
