package com.humanresourcesapp.dto.responses;

import com.humanresourcesapp.entities.enums.EStatus;


import java.time.LocalDateTime;
public record BreakSaveResponseDto(Long id,
                                   Long shiftId,
                                   Long breakStartTime,
                                   Long breakEndTime,
                                   LocalDateTime createdAt,
                                   LocalDateTime updatedAt,
                                   EStatus status) {
}
