package com.humanresourcesapp.dto.requests;

import jakarta.validation.constraints.Email;

public record SendOfferToCustomerRequestDto(
        String emailText,
        @Email(message = "Not a valid Email")
        String offerEmail
)
{
}
