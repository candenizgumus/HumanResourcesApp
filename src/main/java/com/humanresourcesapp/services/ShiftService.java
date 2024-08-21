package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.ShiftSaveRequestDto;
import com.humanresourcesapp.dto.requests.ShiftUpdateRequestDto;
import com.humanresourcesapp.entities.Leave;
import com.humanresourcesapp.entities.Shift;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShiftService {
    private final ShiftRepository shiftRepository;
    private final LeaveService leaveService;
   // private static final ZoneId SERVER_TIME_ZONE = ZoneId.of("Europe/Istanbul");
    public Shift save(ShiftSaveRequestDto dto) {

        //ZonedDateTime.parse(dto.start().toString()).withZoneSameInstant(SERVER_TIME_ZONE);
        return shiftRepository.save(Shift.builder()
                .companyId(dto.companyId())
                        .start(dto.start().plusHours(3)) //TODO LOOK AT LATER to fix time difference issue
                        .endTime(dto.endTime().plusHours(3))
                        .title(dto.title())
                        .description(dto.description())
                        .employeeId(dto.employeeId())
                        .status(EStatus.ACTIVE)

                .build());
    }

    public List<Shift> getAll(Long employeeId)
    {

        List<Shift> shifts = shiftRepository.findAllByEmployeeId(employeeId);
        leaveService.searchByEmployeeId(employeeId).stream().filter(leave -> leave.getStatus().equals(EStatus.ACTIVE)).forEach(leave -> {
            shifts.add(Shift.builder().employeeId(employeeId).start(leave.getStartDate().atTime(8, 1)).endTime(leave.getEndDate().atTime(23,59)).title(leave.getLeaveType()).build());
        });
        return shifts;
    }

    public Shift update(ShiftUpdateRequestDto dto)
    {
        Shift shift = shiftRepository.findById(dto.shiftId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.SHIFT_NOT_FOUND));

        if (dto.start() != null)
        {
            shift.setStart(dto.start().plusHours(3));
        }
        if (dto.endTime() != null)
        {
            shift.setEndTime(dto.endTime().plusHours(3));
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

    public void delete(Long id)
    {
        shiftRepository.deleteById(id);
    }
}
