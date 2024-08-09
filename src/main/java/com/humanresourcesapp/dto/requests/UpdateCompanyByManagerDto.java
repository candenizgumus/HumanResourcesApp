package com.humanresourcesapp.dto.requests;

public record UpdateCompanyByManagerDto(
    String name,
    String description,
    String country
   )
{
}
