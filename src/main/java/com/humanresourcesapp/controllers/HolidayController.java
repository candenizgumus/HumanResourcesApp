package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.HolidaySaveRequestDto;
import com.humanresourcesapp.dto.responses.HolidayResponseDto;
import com.humanresourcesapp.entities.Holiday;
import com.humanresourcesapp.services.HolidayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+HOLIDAY)
@CrossOrigin("*")
public class HolidayController {
    private final HolidayService holidayService;

    @PostMapping(SAVE)
    @CrossOrigin("*")
    public ResponseEntity<Holiday> save(@RequestBody HolidaySaveRequestDto holidaySaveRequestDto) {
        return ResponseEntity.ok(holidayService.save(holidaySaveRequestDto));
    }

    @DeleteMapping(DELETE + "/{holidayId}")
    @CrossOrigin("*")
    public ResponseEntity<Holiday> delete(@PathVariable Long holidayId) {
         return ResponseEntity.ok(holidayService.delete(holidayId));
    }

    @PostMapping(UPDATE)
    @CrossOrigin("*")
    public ResponseEntity<Holiday> update(Long holidayId, HolidaySaveRequestDto holidaySaveRequestDto) {
        return ResponseEntity.ok(holidayService.update(holidayId, holidaySaveRequestDto));
    }

    @GetMapping(GET_ALL)
    @CrossOrigin("*")
    public ResponseEntity<List<HolidayResponseDto>> getAll() {
        return ResponseEntity.ok(holidayService.findAll());
    }
}
