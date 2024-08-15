package com.humanresourcesapp.dto.requests;

import java.time.LocalDateTime;

public record ShiftSaveRequestDto(Long companyId,
        Long employeeId,
        String title,
        String description,
        LocalDateTime start,
        LocalDateTime endTime) {
}
