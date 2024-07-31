package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+NOTIFICATION)
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping(SAVE)
    public ResponseEntity<Notification> save(NotificationSaveRequestDto notificationSaveRequestDto) {
        return ResponseEntity.ok(notificationService.save(notificationSaveRequestDto));
    }

    @PostMapping(GET_BY_ID + "/{userId}")
    public ResponseEntity<List<Notification>> getAllByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getAllById(userId));
    }


}
