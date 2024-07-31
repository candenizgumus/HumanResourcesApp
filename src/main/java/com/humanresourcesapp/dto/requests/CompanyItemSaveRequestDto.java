package com.humanresourcesapp.dto.requests;

import lombok.Builder;

@Builder
public record CompanyItemSaveRequestDto(
        Long companyId,
        String name,
        String description) {
}
