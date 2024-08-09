package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.ENotificationType;

public record NotificationSaveRequestDto(
        Long userId,
        ENotificationType notificationType,
        String notificationText,
        String url) {
}
