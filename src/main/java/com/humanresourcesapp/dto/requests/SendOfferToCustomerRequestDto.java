package com.humanresourcesapp.dto.requests;

public record SendOfferToCustomerRequestDto(
        String emailText,
        String offerEmail
)
{
}