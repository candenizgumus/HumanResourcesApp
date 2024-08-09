package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EUserType;
public record NotificationIsReadUpdateRequestDto(
        Long id,
        Boolean isRead
) {
}
