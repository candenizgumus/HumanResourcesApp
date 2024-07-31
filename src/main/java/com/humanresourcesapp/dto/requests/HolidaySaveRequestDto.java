package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EHolidayType;

public record HolidaySaveRequestDto(String holidayName, EHolidayType holidayType, Long startDate, Long endDate) {
}
