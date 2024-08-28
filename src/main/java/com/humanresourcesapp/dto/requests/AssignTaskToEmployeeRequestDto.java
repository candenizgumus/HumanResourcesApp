package com.humanresourcesapp.dto.requests;

public record AssignTaskToEmployeeRequestDto(

    Long employeeId,
    Long taskId
)
{
}
