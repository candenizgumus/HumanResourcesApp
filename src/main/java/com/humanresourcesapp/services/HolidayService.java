package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.HolidaySaveRequestDto;
import com.humanresourcesapp.dto.responses.HolidayResponseDto;
import com.humanresourcesapp.entities.Holiday;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.HolidayRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HolidayService {
    private final HolidayRepository holidayRepository;
    private final UserService userService;

    public Holiday saveHolidayAdmin(HolidaySaveRequestDto holidaySaveRequestDto) {
        return holidayRepository.save(Holiday.builder()
                .holidayName(holidaySaveRequestDto.holidayName())
                .holidayType(holidaySaveRequestDto.holidayType())
                .startDate(holidaySaveRequestDto.startDate().plusDays(1))
                .endDate(holidaySaveRequestDto.endDate().plusDays(1))
                .status(EStatus.INACTIVE)
                .build());
    }

    public Holiday saveHolidayManager(HolidaySaveRequestDto holidaySaveRequestDto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isEmpty()){
            throw new HumanResourcesAppException(ErrorType.USER_NOT_FOUND);
        }

        List<Holiday> holidayList = holidayRepository.findAll();
        for (Holiday holiday: holidayList) {
            if (
                    Objects.equals(holiday.getCompanyId(), user.get().getCompanyId()) &&
                    (holiday.getStartDate().getMonth().equals(holidaySaveRequestDto.startDate().getMonth()) &&
                    holiday.getStartDate().getDayOfMonth() == holidaySaveRequestDto.startDate().getDayOfMonth() &&
                    holiday.getEndDate().getMonth().equals(holidaySaveRequestDto.endDate().getMonth()) &&
                    holiday.getEndDate().getDayOfMonth() == holidaySaveRequestDto.endDate().getDayOfMonth())
            ) {
                throw new HumanResourcesAppException(ErrorType.HOLIDAY_ALREADY_EXISTS);
            }
        }
        if (holidayRepository.findById(holidaySaveRequestDto.holidayId()).get().getCompanyId() == null)
        {
            return holidayRepository.save(Holiday.builder()
                    .holidayName(holidaySaveRequestDto.holidayName())
                    .holidayType(holidaySaveRequestDto.holidayType())
                    .startDate(holidaySaveRequestDto.startDate())
                    .endDate(holidaySaveRequestDto.endDate())
                    .companyId(user.get().getCompanyId())
                    .status(EStatus.ACTIVE)
                    .build());
        }

        return holidayRepository.save(Holiday.builder()
                .holidayName(holidaySaveRequestDto.holidayName())
                .holidayType(holidaySaveRequestDto.holidayType())
                .startDate(holidaySaveRequestDto.startDate().plusDays(1))
                .endDate(holidaySaveRequestDto.endDate().plusDays(1))
                .companyId(user.get().getCompanyId())
                .status(EStatus.ACTIVE)
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
            holiday.setStartDate(holidaySaveRequestDto.startDate().plusDays(1));
            holiday.setEndDate(holidaySaveRequestDto.endDate().plusDays(1));
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
                    holiday.getStartDate(),
                    holiday.getEndDate()
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

    public List<Holiday> getHolidaysOfCompany() {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        Optional<User> user = userService.findByEmail(userEmail);
        if (user.isPresent()) {
            return holidayRepository.findByCompanyIdAndStatusIn((user.get().getCompanyId()), List.of(EStatus.ACTIVE, EStatus.INACTIVE));
        } else {
            throw new HumanResourcesAppException(ErrorType.USER_NOT_FOUND);
        }
    }

    public Holiday changeStatus(Long holidayId) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        Optional<User> user = userService.findByEmail(userEmail);
        Optional<Holiday> optionalHoliday = holidayRepository.findById(holidayId);
        if (optionalHoliday.isPresent()) {
            Holiday holiday = optionalHoliday.get();
            if (holiday.getStatus().equals(EStatus.ACTIVE)) {
                holiday.setStatus(EStatus.INACTIVE);
                holiday.setCompanyId(user.get().getCompanyId());
            } else {
                holiday.setStatus(EStatus.ACTIVE);
                holiday.setCompanyId(user.get().getCompanyId());
            }
            return holidayRepository.save(holiday);
        } else {
            throw new HumanResourcesAppException(ErrorType.ID_NOT_FOUND);
        }
    }

    public List<Holiday> getCurrentMonthsHolidays()
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        LocalDate now = LocalDate.now();
        int month = now.getMonth().getValue();
        int lastDay = now.lengthOfMonth();

        LocalDate firstDateOfMonth = LocalDate.of(now.getYear(), month, 1);
        LocalDate lastDateOfMonth = LocalDate.of(now.getYear(), month, lastDay);


        return holidayRepository.findAllByStartDateIsBetweenAndCompanyIdAndStatus(firstDateOfMonth, lastDateOfMonth, user.getCompanyId(), EStatus.ACTIVE);
    }
}
