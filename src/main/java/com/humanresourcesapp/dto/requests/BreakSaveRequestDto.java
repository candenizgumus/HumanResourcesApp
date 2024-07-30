package com.humanresourcesapp.dto.requests;

public record BreakSaveRequestDto(Long shiftId, Long breakStartTime, Long breakEndTime) {
}
