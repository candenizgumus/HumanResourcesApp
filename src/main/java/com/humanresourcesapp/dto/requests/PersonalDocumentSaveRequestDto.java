package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EDocumentType;
import jakarta.annotation.Nullable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record PersonalDocumentSaveRequestDto(Long employeeId, EDocumentType documentType, @Nullable List<MultipartFile> files) {
}
