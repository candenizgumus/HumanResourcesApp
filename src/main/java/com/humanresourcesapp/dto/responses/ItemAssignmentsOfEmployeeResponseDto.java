package com.humanresourcesapp.dto.responses;

import java.time.LocalDate;

public record ItemAssignmentsOfEmployeeResponseDto(Long id, String name, LocalDate assignDate)
{
}
