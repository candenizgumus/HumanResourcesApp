package com.humanresourcesapp.controllers;


import com.humanresourcesapp.dto.requests.ExpenditureDownloadRequestDto;
import com.humanresourcesapp.dto.requests.UploadFileRequestDto;
import com.humanresourcesapp.dto.responses.UrlResponseDto;
import com.humanresourcesapp.services.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.humanresourcesapp.constants.Endpoints.*;


@RestController
@RequestMapping(ROOT+S3)
@RequiredArgsConstructor
@CrossOrigin("*")
public class S3Controller
{
    private final S3Service s3Service;

    @PostMapping(DOWNLOAD)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<UrlResponseDto> downloadFile(@RequestBody ExpenditureDownloadRequestDto dto) {
        return ResponseEntity.ok(s3Service.getPresignedUrl(dto.fileName()));
    }

   /* @PostMapping(UPLOAD)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<Boolean> uploadFile(@RequestBody UploadFileRequestDto dto) {
        return ResponseEntity.ok(s3Service.uploadFile(dto));
    }*/


}
