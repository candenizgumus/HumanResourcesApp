package com.humanresourcesapp.dto.requests;

import java.time.LocalDateTime;

public record ShiftUpdateRequestDto(Long shiftId,
                                    String title,
                                    String description,
                                    LocalDateTime start,
                                    LocalDateTime endTime) {
}
