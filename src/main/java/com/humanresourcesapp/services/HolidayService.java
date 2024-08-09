package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.HolidaySaveRequestDto;
import com.humanresourcesapp.dto.responses.HolidayResponseDto;
import com.humanresourcesapp.entities.Holiday;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.HolidayRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HolidayService {
    private final HolidayRepository holidayRepository;
    private final UserService userService;

    public Holiday save(HolidaySaveRequestDto holidaySaveRequestDto) {
        return holidayRepository.save(Holiday.builder()
                .holidayName(holidaySaveRequestDto.holidayName())
                .holidayType(holidaySaveRequestDto.holidayType())
                .companyId(holidaySaveRequestDto.companyId())
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

    public void saveAll(List<Holiday> holidayList) {
        holidayRepository.saveAll(holidayList);
    }

    public List<Holiday> getHolidaysForUser() {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isPresent()) {
            List<Holiday> byCompanyId = holidayRepository.findByCompanyId(user.get().getCompanyId());
            List<Holiday> holidaysForAdmin = getHolidaysForAdmin();
            byCompanyId.addAll(holidaysForAdmin);
            return byCompanyId;
        } else {
            throw new HumanResourcesAppException(ErrorType.USER_NOT_FOUND);
        }
    }

    public List<Holiday> getHolidaysForAdmin() {
        List<Holiday> holidayList = holidayRepository.findAll();
        List<Holiday> holidayListAdmin = new ArrayList<>();
        for (Holiday holiday: holidayList) {
            if (holiday.getCompanyId() == null) {
                holidayListAdmin.add(holiday);
            }
        }
        return holidayListAdmin;
    }
}
