package com.humanresourcesapp.dto.responses;


import com.humanresourcesapp.entities.enums.EHolidayType;

public record HolidayResponseDto(Long id, String holidayName, EHolidayType holidayType, Long holidayStartDate, Long holidayEndDate) {
}
