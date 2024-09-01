package com.humanresourcesapp.dto.requests;

public record SlideRequestDto(
        String city,
        String district,
        String neighborhood,
        String projection,
        String concept
)
{
}
