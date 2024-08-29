package com.humanresourcesapp.dto.requests;

import lombok.Builder;

import java.util.Map;
@Builder
public record TimeDataSaveRequestDto(
        String userName,
        Long slideId,
        Map<String, Double> imageTimes,  // Changed to Map<String, Double>
        String userIp
) {
}

