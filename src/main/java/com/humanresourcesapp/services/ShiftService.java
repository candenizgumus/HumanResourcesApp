package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.ShiftSaveRequestDto;
import com.humanresourcesapp.entities.Shift;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.repositories.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShiftService {
    private final ShiftRepository shiftRepository;

    public Shift save(ShiftSaveRequestDto dto) {

        return shiftRepository.save(Shift.builder()
                .companyId(dto.companyId())
                        .start(dto.start())
                        .endTime(dto.endTime())
                        .title(dto.title())
                        .description(dto.description())
                        .employeeId(dto.employeeId())
                        .status(EStatus.ACTIVE)

                .build());
    }

    public List<Shift> getAll(Long employeeId)
    {
        return shiftRepository.findAllByEmployeeId(employeeId);
    }
}
