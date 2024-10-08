package com.humanresourcesapp.dto.responses;

import lombok.Builder;

@Builder
public record NotificationResponseDto(
        Long id,
        Long userId,
        Long companyId,
        String notificationType,
        String notificationText,
        Boolean isRead,
        String userType,
        String url
) {
}
