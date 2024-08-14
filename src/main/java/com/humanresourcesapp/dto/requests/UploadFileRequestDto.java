package com.humanresourcesapp.dto.requests;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record UploadFileRequestDto(List<MultipartFile> files)
{
}
