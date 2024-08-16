package com.humanresourcesapp.dto.requests;

import jakarta.validation.constraints.Email;
import lombok.Builder;

@Builder
public record SaveContactUsNotificationRequestDto(
        String senderName,
        @Email(message = "Not a valid Email")
        String senderEmail,
        String subject,
        String message
) {
}
