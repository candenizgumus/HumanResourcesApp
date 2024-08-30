package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.TimeDataGetRequestDto;
import com.humanresourcesapp.dto.requests.TimeDataSaveRequestDto;
import com.humanresourcesapp.dto.responses.TimeDatasResponseDto;
import com.humanresourcesapp.entities.TimeData;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.TimeDataRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeDataService
{
    private final TimeDataRepository timeDataRepository;
    private final UserService userService;

    public boolean save(TimeDataSaveRequestDto dto)
    {
        timeDataRepository.save(TimeData.builder()
                .userName(dto.userName())
                .imageTimes(dto.imageTimes())
                .slideId(dto.slideId())
                .userIp(dto.userIp())
                .companyId(dto.companyId())
                .status(EStatus.ACTIVE)
                .build());
        return true;
    }

    public List<String> findAllDistinctUsernames()
    {
        return timeDataRepository.findAllDistinctUsernames();
    }

    public List<Long> getUsernamesSlides(String username)
    {
        return timeDataRepository.findAllUsernamesSlides(username);
    }

    public List<TimeDatasResponseDto> getAllByUsernameAndSlideId(TimeDataGetRequestDto dto)
    {
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        List<TimeData> timeDatas = timeDataRepository.findAllByUserNameAndSlideIdAndCompanyId(dto.userName(), dto.slideId(), manager.getCompanyId());

        // Yeni bir harita oluşturarak, her bir sayfa numarası için toplam zamanı hesaplayalım
        Map<String, Double> combinedImageTimes = new HashMap<>();

        timeDatas.forEach(timeData ->
        {
            timeData.getImageTimes().forEach((pageNumber, timeSpent) ->
            {
                combinedImageTimes.merge(pageNumber, timeSpent, Double::sum);
            });
        });

        // Yeni TimeData nesnesi oluşturup, topladığımız değerleri bu nesneye atayabiliriz
        TimeData combinedTimeData = TimeData.builder()
                .userName(dto.userName())
                .slideId(dto.slideId())
                .imageTimes(combinedImageTimes)
                .userIp(timeDatas.getFirst().getUserIp())
                .createdAt(timeDatas.getFirst().getCreatedAt())
                .updatedAt(timeDatas.getFirst().getUpdatedAt())
                .build();

        List<TimeDatasResponseDto> imageTimeDtos = new ArrayList<>();
        AtomicLong id = new AtomicLong(1L);
        // Her bir TimeData nesnesi için
        combinedImageTimes.forEach((pageNumber, timeSpent) ->
        {
            imageTimeDtos.add(new TimeDatasResponseDto(
                    id.getAndIncrement(),
                    combinedTimeData.getUserName(),
                    combinedTimeData.getSlideId(),
                    pageNumber,
                    timeSpent,
                    combinedTimeData.getUserIp(),
                    combinedTimeData.getCreatedAt(),
                    combinedTimeData.getUpdatedAt()
            ));
        });

        // Tek bir birleşik TimeData nesnesi dönebilir veya isteğe bağlı olarak listeye ekleyip dönebilirsiniz
        return imageTimeDtos.stream()
                .sorted(Comparator.comparingInt(imgdto -> Integer.parseInt(imgdto.pageNumber())))
                .collect(Collectors.toList());
    }


    public void deleteTimeDataBySlideId(Long id)
    {
        timeDataRepository.deleteAllBySlideId(id);
    }
}
