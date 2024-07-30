package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.Holiday;
import com.humanresourcesapp.repositories.HolidayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HolidayService {
    private final HolidayRepository holidayRepository;

    public Holiday save(Holiday holiday) {
        return holidayRepository.save(holiday);
    }
}
