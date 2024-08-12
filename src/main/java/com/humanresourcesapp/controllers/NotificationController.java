package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.NotificationIsReadUpdateRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.SaveContactUsNotificationRequestDto;
import com.humanresourcesapp.dto.responses.NotificationResponseDto;
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
@CrossOrigin("*")
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping(SAVE_CONTACT_US_NOTIFICATION)
    @CrossOrigin("*")
    public ResponseEntity<Notification> saveContactUsNotification(@RequestBody SaveContactUsNotificationRequestDto notificationSaveDto) {
        return ResponseEntity.ok(notificationService.saveContactUsNotification(notificationSaveDto));
    }

    @PostMapping(GET_ALL_UNREAD)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    public ResponseEntity<List<NotificationResponseDto>> getAllUnread() {
        return ResponseEntity.ok(notificationService.getAllUnread());
    }

    @PostMapping(GET_ALL)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    public ResponseEntity<List<NotificationResponseDto>> getAll(@RequestBody PageRequestDto dto) {
        return ResponseEntity.ok(notificationService.getAll(dto));
    }

    @PostMapping(UPDATE_IS_READ)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    public ResponseEntity<Boolean> updateIsRead(@RequestBody NotificationIsReadUpdateRequestDto dto) {
        return ResponseEntity.ok(notificationService.updateIsRead(dto));
    }

    @DeleteMapping(DELETE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN','EMPLOYEE')")
    public ResponseEntity<Boolean> delete(@RequestParam Long id) {
        return ResponseEntity.ok(notificationService.delete(id));
    }
}
