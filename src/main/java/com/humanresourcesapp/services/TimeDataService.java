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
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;
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
                .slideId(UUID.fromString(dto.slideId()))
                .userIp(dto.userIp())
                .companyId(dto.companyId())
                .status(EStatus.ACTIVE)
                .build());
        return true;
    }

        public List<String> findAllDistinctUsernames()
    {
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return timeDataRepository.findAllDistinctUsernames(manager.getCompanyId());
    }

    public List<String> getUsernamesSlides(String username)
    {
        List<String> slideIds = new ArrayList<>();
        timeDataRepository.findAllUsernamesSlides(username).forEach(slideId -> {
            slideIds.add(String.valueOf(slideId));
        });
        return slideIds;
    }

    public List<TimeDatasResponseDto> getAllByUsernameAndSlideId(TimeDataGetRequestDto dto) {
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email)
                .orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        List<TimeData> timeDatas = timeDataRepository.findAllByUserNameAndSlideIdAndCompanyId(
                dto.userName(),
                UUID.fromString(dto.slideId()),
                manager.getCompanyId()
        );

        // Her sayfa için toplam zamanı ve toplam ziyaret sayısını hesaplayacak haritalar oluşturuyoruz
        Map<String, Double> combinedImageTimes = new HashMap<>();
        Map<String, Integer> pageVisitCounts = new HashMap<>();

        timeDatas.forEach(timeData -> {
            timeData.getImageTimes().forEach((pageNumber, timeSpent) -> {
                combinedImageTimes.merge(pageNumber, timeSpent, Double::sum);
                pageVisitCounts.merge(pageNumber, 1, Integer::sum); // Sayfa ziyareti sayısını artırıyoruz
            });
        });

        // Yeni TimeData nesnesi oluşturuyoruz
        TimeData combinedTimeData = TimeData.builder()
                .userName(dto.userName())
                .slideId(UUID.fromString(dto.slideId()))
                .imageTimes(combinedImageTimes)
                .userIp(timeDatas.get(0).getUserIp())
                .createdAt(timeDatas.get(0).getCreatedAt())
                .updatedAt(timeDatas.get(0).getUpdatedAt())
                .build();

        // Sonuçları içeren DTO listesini oluşturuyoruz
        List<TimeDatasResponseDto> imageTimeDtos = new ArrayList<>();
        AtomicLong id = new AtomicLong(1L);

        combinedImageTimes.forEach((pageNumber, timeSpent) -> {
            int visitCount = pageVisitCounts.get(pageNumber); // Sayfa ziyareti sayısını alıyoruz
            imageTimeDtos.add(new TimeDatasResponseDto(
                    id.getAndIncrement(),
                    combinedTimeData.getUserName(),
                    visitCount, // Sayfa ziyareti sayısını burada kullanıyoruz
                    combinedTimeData.getSlideId().toString(),
                    pageNumber,
                    timeSpent,
                    combinedTimeData.getUserIp(),
                    combinedTimeData.getCreatedAt(),
                    combinedTimeData.getUpdatedAt()
            ));
        });

        // Sonuçları sayfa numarasına göre sıralayıp döndürüyoruz
        return imageTimeDtos.stream()
                .sorted(Comparator.comparingInt(imgdto -> Integer.parseInt(imgdto.pageNumber())))
                .collect(Collectors.toList());
    }



    public void deleteTimeDataBySlideId(String id)
    {
        timeDataRepository.deleteAllBySlideId(UUID.fromString(id));
    }
}
