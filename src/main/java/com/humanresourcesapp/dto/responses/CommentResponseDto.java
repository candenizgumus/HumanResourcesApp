package com.humanresourcesapp.dto.responses;

import lombok.Builder;

@Builder
public record CommentResponseDto(
        Long id,
        String managerName,
        String companyName,
        String title,
        String shortDescription,
        String longDescription,
        String photo,
        String sector,
        Integer numberOfEmployees,
        String logo,
        String country) {
}
