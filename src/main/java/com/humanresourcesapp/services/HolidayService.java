package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.HolidaySaveRequestDto;
import com.humanresourcesapp.dto.responses.HolidayResponseDto;
import com.humanresourcesapp.entities.Holiday;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.HolidayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HolidayService {
    private final HolidayRepository holidayRepository;

    public Holiday save(HolidaySaveRequestDto holidaySaveRequestDto) {
        System.out.println("servis: "+holidaySaveRequestDto);
        return holidayRepository.save(Holiday.builder()
                .holidayName(holidaySaveRequestDto.holidayName())
                .holidayType(holidaySaveRequestDto.holidayType())
                .holidayStartDate(holidaySaveRequestDto.holidayStartDate())
                .holidayEndDate(holidaySaveRequestDto.holidayEndDate())
                .build());
    }

    public Holiday delete(Long holidayId) {
        Optional<Holiday> optionalHoliday = holidayRepository.findById(holidayId);
        if (optionalHoliday.isPresent()) {
            holidayRepository.delete(optionalHoliday.get());
            return optionalHoliday.get();
        } else {
            throw new HumanResourcesAppException(ErrorType.ID_NOT_FOUND);
        }
    }

    public Holiday update(Long holidayId, HolidaySaveRequestDto holidaySaveRequestDto) {
        Optional<Holiday> optionalHoliday = holidayRepository.findById(holidayId);
        if (optionalHoliday.isPresent()) {
            Holiday holiday = optionalHoliday.get();
            holiday.setHolidayName(holidaySaveRequestDto.holidayName());
            holiday.setHolidayType(holidaySaveRequestDto.holidayType());
            holiday.setHolidayStartDate(holidaySaveRequestDto.holidayStartDate());
            holiday.setHolidayEndDate(holidaySaveRequestDto.holidayEndDate());
            return holidayRepository.save(holiday);
        } else {
            throw new HumanResourcesAppException(ErrorType.ID_NOT_FOUND);
        }
    }

    public List<HolidayResponseDto> findAll() {
        List<Holiday> holidayList = holidayRepository.findAll();
        List<HolidayResponseDto> holidayResponseDtoList = new ArrayList<>();
        for (Holiday holiday: holidayList) {
            holidayResponseDtoList.add(new HolidayResponseDto(
                    holiday.getId(),
                    holiday.getHolidayName(),
                    holiday.getHolidayType(),
                    holiday.getHolidayStartDate(),
                    holiday.getHolidayEndDate()
            ));
        }
        return holidayResponseDtoList;
    }
}
