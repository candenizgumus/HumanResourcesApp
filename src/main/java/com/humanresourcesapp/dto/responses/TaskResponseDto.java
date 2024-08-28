package com.humanresourcesapp.dto.responses;

import com.humanresourcesapp.entities.enums.EStatus;

import java.time.LocalDate;

public record TaskResponseDto(
    Long id,
    String taskName,
    String assignedEmployeeName,
    LocalDate assignedDate,
    LocalDate completionDate,
    Integer numberOfCompletedSubtasks,
    Integer numberOfSubTasks,

    EStatus status)
{
}
