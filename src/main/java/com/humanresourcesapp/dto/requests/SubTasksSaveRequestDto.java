package com.humanresourcesapp.dto.requests;

public record SubTasksSaveRequestDto(
        String subTaskName,
        Long taskId
)
{
}
