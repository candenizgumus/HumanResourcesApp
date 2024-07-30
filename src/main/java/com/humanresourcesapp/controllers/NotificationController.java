package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+NOTIFICATION)
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping(SAVE)
    public ResponseEntity<Notification> save(Notification notification) {
        return ResponseEntity.ok(notificationService.save(notification));
    }
}
