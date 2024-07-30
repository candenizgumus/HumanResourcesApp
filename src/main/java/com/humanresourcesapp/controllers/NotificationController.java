package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notification")
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping("/save")
    public ResponseEntity<Notification> save(Notification notification) {
        return ResponseEntity.ok(notificationService.save(notification));
    }
}
