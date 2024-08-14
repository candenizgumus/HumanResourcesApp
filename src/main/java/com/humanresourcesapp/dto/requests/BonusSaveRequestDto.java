package com.humanresourcesapp.dto.requests;

import java.time.LocalDate;

public record BonusSaveRequestDto(Long employeeId, String description, Double bonusAmount, LocalDate bonusDate)
{
}
