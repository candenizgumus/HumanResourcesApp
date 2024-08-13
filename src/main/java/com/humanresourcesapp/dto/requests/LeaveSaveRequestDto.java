package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.ELeaveType;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Builder
public record LeaveSaveRequestDto(
        String description,
        LocalDate startDate,
        LocalDate endDate,
        ELeaveType leaveType,
        List<MultipartFile> files) {
}
