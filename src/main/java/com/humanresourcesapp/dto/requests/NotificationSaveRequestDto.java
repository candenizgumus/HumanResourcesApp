package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EAccessIdentifier;
import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import lombok.Builder;

@Builder
public record NotificationSaveRequestDto(
        Long userId,
        ENotificationType notificationType,
        String notificationText,
        String url,
        Boolean isRead,
        EStatus status,
        EUserType userType,
        EAccessIdentifier accessIdentifier) {
}
