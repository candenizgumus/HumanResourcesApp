package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PostMapping(GET_ALL)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    public ResponseEntity<List<Notification>> getAll() {
        return ResponseEntity.ok(notificationService.getAll());
    }


}
