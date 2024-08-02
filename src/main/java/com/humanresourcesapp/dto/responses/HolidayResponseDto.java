package com.humanresourcesapp.dto.responses;

import com.humanresourcesapp.entities.enums.EHolidayType;

import java.time.LocalDateTime;

public record HolidayResponseDto(String holidayName, EHolidayType holidayType, Long holidayStartDate, Long holidayEndDate) {
}
