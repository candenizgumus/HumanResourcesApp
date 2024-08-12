package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.ELeaveType;
import lombok.Builder;

import java.time.LocalDate;
@Builder
public record LeaveSaveRequestDto(
        String description,
        LocalDate startDate,
        LocalDate endDate,
        ELeaveType leaveType,
        String attachedFile,
        Long employeeId) {
}
