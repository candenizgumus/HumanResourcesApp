package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EDocumentType;

public record PersonalDocumentSaveRequestDto(Long employeeId, EDocumentType documentType, String documentFile) {
}
