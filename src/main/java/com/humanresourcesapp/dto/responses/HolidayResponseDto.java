package com.humanresourcesapp.dto.responses;


import com.humanresourcesapp.entities.enums.EHolidayType;

import java.time.LocalDate;

public record HolidayResponseDto(
        Long id,
        String holidayName,
        EHolidayType holidayType,
        LocalDate startDate,
        LocalDate endDate) {
}
