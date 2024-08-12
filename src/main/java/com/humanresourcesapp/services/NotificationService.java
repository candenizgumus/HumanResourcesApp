package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.dto.requests.NotificationIsReadUpdateRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.SaveContactUsNotificationRequestDto;
import com.humanresourcesapp.dto.responses.NotificationResponseDto;
import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.NotificationRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import static com.humanresourcesapp.constants.FrontendPaths.HOME;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private UserService userService;

    //To break circular reference in UserService
    @Autowired
    public void setUserService(@Lazy UserService userService) {
        this.userService = userService;
    }

    public Notification save(NotificationSaveRequestDto notificationSaveRequestDto) {
        return notificationRepository.save(Notification.builder()
                .userId(notificationSaveRequestDto.userId())
                .notificationText(notificationSaveRequestDto.notificationText())
                .notificationType(notificationSaveRequestDto.notificationType())
                .userType(notificationSaveRequestDto.userType())
                .url(notificationSaveRequestDto.url())
                        .status(EStatus.ACTIVE)
                .build());
    }

    public List<NotificationResponseDto> getAllUnread() {
        List<NotificationResponseDto> all = new ArrayList<>();
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        for(Notification notification : notificationRepository.findAllByUserIdAndIsReadAndStatus(user.getId(), false, EStatus.ACTIVE)) {
            all.add(NotificationResponseDto.builder()
                            .id(notification.getId())
                            .userId(notification.getUserId())
                            .isRead(notification.getIsRead())
                            .notificationText(notification.getNotificationText())
                            .notificationType(notification.getNotificationType().name())
                            .userType(notification.getUserType() == null ? null : notification.getUserType().name())
                            .url(notification.getUrl())
                    .build());
        }

        for(Notification notification : notificationRepository.findAllByUserTypeAndIsReadAndStatus(user.getUserType(), false, EStatus.ACTIVE)) {
            all.add(NotificationResponseDto.builder()
                            .id(notification.getId())
                            .userId(notification.getUserId())
                            .isRead(notification.getIsRead())
                            .notificationText(notification.getNotificationText())
                            .notificationType(notification.getNotificationType().name())
                            .userType(notification.getUserType().name())
                            .url(notification.getUrl())
                    .build());
        }
        return all;
    }

    public Boolean updateIsRead(NotificationIsReadUpdateRequestDto dto) {
        Notification notification = notificationRepository.findById(dto.id()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.NOTIFICATION_NOT_FOUND));
        notification.setIsRead(dto.isRead());
        notificationRepository.save(notification);
        return true;
    }


    public List<NotificationResponseDto> getAll (PageRequestDto dto) {
        List<NotificationResponseDto> all = new ArrayList<>();
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        for(Notification notification : notificationRepository.findAllByUserIdAndStatus(user.getId(),EStatus.ACTIVE, PageRequest.of(dto.page(), dto.pageSize()))) {
            all.add(NotificationResponseDto.builder()
                    .id(notification.getId())
                    .userId(notification.getUserId())
                    .isRead(notification.getIsRead())
                    .notificationText(notification.getNotificationText())
                    .notificationType(notification.getNotificationType().name())
                    .userType(notification.getUserType() == null ? null : notification.getUserType().name())
                    .url(notification.getUrl())
                    .build());
        }

        for(Notification notification : notificationRepository.findAllByUserTypeAndStatus(user.getUserType(),EStatus.ACTIVE, PageRequest.of(dto.page(), dto.pageSize()))) {
            all.add(NotificationResponseDto.builder()
                    .id(notification.getId())
                    .userId(notification.getUserId())
                    .isRead(notification.getIsRead())
                    .notificationText(notification.getNotificationText())
                    .notificationType(notification.getNotificationType().name())
                    .userType(notification.getUserType().name())
                    .url(notification.getUrl())
                    .build());
        }
        return all;
    }

    public Boolean delete(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.NOTIFICATION_NOT_FOUND));
        notification.setStatus(EStatus.DELETED);
        notificationRepository.save(notification);
        return true;
    }

    public Notification saveContactUsNotification(SaveContactUsNotificationRequestDto notificationSaveDto) {
        return save(NotificationSaveRequestDto.builder()
                .notificationText(notificationSaveDto.subject())
                .userType(EUserType.ADMIN)
                .userId(0L)
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.ASSIST)
                .url(HOME)
                .build());
    }
}
