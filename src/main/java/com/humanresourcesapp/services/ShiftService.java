package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.ShiftSaveRequestDto;
import com.humanresourcesapp.dto.requests.ShiftUpdateRequestDto;
import com.humanresourcesapp.entities.Shift;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
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
                        .start(dto.start().plusHours(3)) //TODO LOOK AT LATER to fix time difference issue
                        .endTime(dto.start().plusHours(3))
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

    public Shift update(ShiftUpdateRequestDto dto)
    {
        Shift shift = shiftRepository.findById(dto.shiftId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.SHIFT_NOT_FOUND));

        if (dto.start() != null)
        {
            shift.setStart(dto.start());
        }
        if (dto.endTime() != null)
        {
            shift.setEndTime(dto.endTime());
        }
        if (dto.title() != null)
        {
            shift.setTitle(dto.title());
        }
        if (dto.description() != null)
        {
            shift.setDescription(dto.description());
        }
       return shiftRepository.save(shift);
    }
}
