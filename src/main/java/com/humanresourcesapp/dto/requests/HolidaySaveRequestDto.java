package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EHolidayType;
import com.humanresourcesapp.entities.enums.EStatus;

public record HolidaySaveRequestDto(String holidayName, EHolidayType holidayType, Long holidayStartDate, Long holidayEndDate, EStatus status) {
}
