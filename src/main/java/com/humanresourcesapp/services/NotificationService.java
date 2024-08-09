package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.NotificationRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
                .url(notificationSaveRequestDto.url())
                .build());
    }

    public List<Notification> getAll() {
        List<Notification> all = new ArrayList<>();
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        if(user.getId() != 0){
            all.addAll(notificationRepository.findAllByUserId(user.getId()));
        }
        all.addAll(notificationRepository.findAllByUserType(user.getUserType()));
        return all;
    }
}
