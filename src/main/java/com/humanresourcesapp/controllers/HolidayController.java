package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.HolidaySaveRequestDto;
import com.humanresourcesapp.entities.Holiday;
import com.humanresourcesapp.services.HolidayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+HOLIDAY)
public class HolidayController {
    private final HolidayService holidayService;

    @PostMapping(SAVE)
    public ResponseEntity<Holiday> save(HolidaySaveRequestDto holidaySaveRequestDto) {
        return ResponseEntity.ok(holidayService.save(holidaySaveRequestDto));
    }

    @PostMapping(DELETE + "/{holidayId}")
    public ResponseEntity<Holiday> delete(@PathVariable Long holidayId) {
         return ResponseEntity.ok(holidayService.delete(holidayId));
    }

    @PostMapping(UPDATE)
    public ResponseEntity<Holiday> update(Long holidayId, HolidaySaveRequestDto holidaySaveRequestDto) {
        return ResponseEntity.ok(holidayService.update(holidayId, holidaySaveRequestDto));
    }
}
