package com.humanresourcesapp.dto.requests;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record ExpenditureSaveRequestDto(
        String description,
        Double price,
        List<MultipartFile> files)
{
}
