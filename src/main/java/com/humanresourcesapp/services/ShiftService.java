package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.ShiftSaveRequestDto;
import com.humanresourcesapp.entities.Shift;
import com.humanresourcesapp.repositories.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShiftService {
    private final ShiftRepository shiftRepository;

    public Shift save(ShiftSaveRequestDto dto) {
        return shiftRepository.save(Shift.builder()
                .companyId(dto.companyId())
                .shiftName(dto.shiftName())
                .shiftStartTime(dto.shiftStartTime())
                .shiftEndTime(dto.shiftEndTime())
                .build());
    }
}
