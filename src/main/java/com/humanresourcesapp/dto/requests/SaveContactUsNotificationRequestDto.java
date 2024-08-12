package com.humanresourcesapp.dto.requests;

import lombok.Builder;

@Builder
public record SaveContactUsNotificationRequestDto(
        String senderName,
        String senderEmail,
        String subject,
        String message
) {
}
