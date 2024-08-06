package com.humanresourcesapp.dto.requests;

import lombok.Builder;

@Builder
public record CompanySaveRequestDto(Long id, String name, String logo, String description, Integer numberOfEmployee) {
}
