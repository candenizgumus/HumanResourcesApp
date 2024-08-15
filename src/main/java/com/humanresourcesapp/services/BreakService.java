package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.BreakSaveRequestDto;
import com.humanresourcesapp.dto.responses.BreakSaveResponseDto;
import com.humanresourcesapp.entities.Break;
import com.humanresourcesapp.repositories.BreakRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BreakService {
    private final BreakRepository breakRepository;

    public BreakSaveResponseDto save(BreakSaveRequestDto dto) {
        Break breakEntity = breakRepository.save(Break.builder().breakStartTime(dto.breakStartTime()).breakEndTime(dto.breakEndTime()).shiftId(dto.shiftId()).build());
        return new BreakSaveResponseDto(
                breakEntity.getId(),
                breakEntity.getShiftId(),
                breakEntity.getBreakStartTime(),
                breakEntity.getBreakEndTime(),
                breakEntity.getCreatedAt(),
                breakEntity.getUpdatedAt(),
                breakEntity.getStatus()
        );
    }

//    private LocalDateTime Long(Long timestamp) {
//        return LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.systemDefault());
//    }
}
