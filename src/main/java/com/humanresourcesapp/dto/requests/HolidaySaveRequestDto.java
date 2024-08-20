package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EHolidayType;
import com.humanresourcesapp.entities.enums.EStatus;

import java.time.LocalDate;

public record HolidaySaveRequestDto(String holidayName,
                                    EHolidayType holidayType,
                                    LocalDate startDate,
                                    LocalDate endDate,
                                    EStatus status,
                                    Long holidayId

)
{
}
