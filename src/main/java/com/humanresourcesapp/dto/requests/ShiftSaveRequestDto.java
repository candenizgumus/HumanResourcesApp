package com.humanresourcesapp.dto.requests;

public record ShiftSaveRequestDto(Long companyId, String shiftName, Long shiftStartTime, Long shiftEndTime) {
}
