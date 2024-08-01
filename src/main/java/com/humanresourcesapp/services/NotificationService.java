package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.HolidayRepository;
import com.humanresourcesapp.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public Notification save(NotificationSaveRequestDto notificationSaveRequestDto) {
        return notificationRepository.save(Notification.builder()
                .userId(notificationSaveRequestDto.userId())
                .notificationText(notificationSaveRequestDto.notificationText())
                .notificationType(notificationSaveRequestDto.notificationType())
                .build());
    }

    public List<Notification> getAllById(Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            throw new HumanResourcesAppException(ErrorType.USER_NOT_FOUND);
        } else {
            return notificationRepository.findAllByUserId(userId);
        }
    }
}
