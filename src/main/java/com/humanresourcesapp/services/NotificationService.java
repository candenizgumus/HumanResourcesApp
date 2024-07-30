package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.repositories.HolidayRepository;
import com.humanresourcesapp.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }
}
