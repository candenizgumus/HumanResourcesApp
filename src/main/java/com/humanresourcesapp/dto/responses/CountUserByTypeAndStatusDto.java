package com.humanresourcesapp.dto.responses;

public record CountUserByTypeAndStatusDto(
        Long totalManager,
        Long activeManager,
        Long totalEmployee,
        Long activeEmployee
)
{

}
