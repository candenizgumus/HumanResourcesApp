package com.humanresourcesapp.dto.responses;

import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;


public record TimeDatasResponseDto(
        Long id,
        String userName,
        String slideId,
        String pageNumber,
        Double timeSpent,
        String userIp,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
)
{
}
