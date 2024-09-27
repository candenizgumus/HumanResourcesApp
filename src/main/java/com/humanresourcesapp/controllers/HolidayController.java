package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.HolidaySaveRequestDto;
import com.humanresourcesapp.dto.responses.HolidayResponseDto;
import com.humanresourcesapp.entities.Holiday;
import com.humanresourcesapp.services.HolidayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+HOLIDAY)
public class HolidayController {
    private final HolidayService holidayService;

    @PostMapping(SAVE_HOLIDAY_ADMIN)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Holiday> saveHolidayAdmin(@RequestBody HolidaySaveRequestDto holidaySaveRequestDto) {
        return ResponseEntity.ok(holidayService.saveHolidayAdmin(holidaySaveRequestDto));
    }

    @PostMapping(SAVE_HOLIDAY_MANAGER)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Holiday> saveHolidayManager(@RequestBody HolidaySaveRequestDto holidaySaveRequestDto) {
        return ResponseEntity.ok(holidayService.saveHolidayManager(holidaySaveRequestDto));
    }

    @DeleteMapping(DELETE + "/{holidayId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Holiday> delete(@PathVariable Long holidayId) {
         return ResponseEntity.ok(holidayService.delete(holidayId));
    }

    @PostMapping(UPDATE)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Holiday> update(Long holidayId, HolidaySaveRequestDto holidaySaveRequestDto) {
        return ResponseEntity.ok(holidayService.update(holidayId, holidaySaveRequestDto));
    }

    @GetMapping(GET_ALL)
    public ResponseEntity<List<HolidayResponseDto>> getAll() {
        return ResponseEntity.ok(holidayService.findAll());
    }

    @PostMapping(GET_HOLIDAY_BY_ADMIN)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Holiday>> getHolidaysByCompanyIdAdmin() {
        return ResponseEntity.ok(holidayService.getHolidaysForAdmin());
    }

    @PostMapping(GET_HOLIDAY_BY_USER)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<Holiday>> getHolidaysByCompanyIdUser() {
        return ResponseEntity.ok(holidayService.getHolidaysForUser());
    }

    @PostMapping(GET_HOLIDAYS_OF_COMPANY)
    @PreAuthorize("hasAnyAuthority('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<Holiday>> getHolidaysOfCompany(){
        return ResponseEntity.ok(holidayService.getHolidaysOfCompany());
    }

    @PutMapping(CHANGE_STATUS + "/{holidayId}")
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Holiday> changeStatus(@PathVariable Long holidayId) {
        return ResponseEntity.ok(holidayService.changeStatus(holidayId));
    }

    @PostMapping(GET_CURRENT_MONTHS_HOLIDAYS)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<Holiday>> getCurrentMonthsHolidays() {
        return ResponseEntity.ok(holidayService.getCurrentMonthsHolidays());
    }
}
