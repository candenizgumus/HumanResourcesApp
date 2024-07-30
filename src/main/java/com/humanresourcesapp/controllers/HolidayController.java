package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.Holiday;
import com.humanresourcesapp.services.HolidayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/holiday")
public class HolidayController {
    private final HolidayService holidayService;

    @PostMapping("/save1")
    public ResponseEntity<Holiday> save(Holiday holiday) {
        return ResponseEntity.ok(holidayService.save(holiday));
    }
}
