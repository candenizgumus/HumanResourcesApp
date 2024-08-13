package com.humanresourcesapp.dto.requests;

import java.time.LocalDate;

public record PaymentSaveRequestDto(LocalDate paymentDate, Double payment, String description)
{
}
