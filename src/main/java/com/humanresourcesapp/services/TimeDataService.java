package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.TimeDataSaveRequestDto;
import com.humanresourcesapp.entities.TimeData;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.repositories.TimeDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TimeDataService {
    private final TimeDataRepository timeDataRepository;

    public boolean save(TimeDataSaveRequestDto dto) {
         timeDataRepository.save(TimeData.builder()
                .userName(dto.userName())
                        .imageTimes(dto.imageTimes())
                                .slideId(dto.slideId())
                        .userIp(dto.userIp())
                         .status(EStatus.ACTIVE)
                .build());
        return true;
    }
}
