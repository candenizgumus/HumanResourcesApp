package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.ShiftSaveRequestDto;
import com.humanresourcesapp.entities.Shift;
import com.humanresourcesapp.services.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/shifts")
@CrossOrigin("*")
public class ShiftController {
    private final ShiftService shiftService;
    @PostMapping("/save")
    public ResponseEntity<Shift> save(ShiftSaveRequestDto dto) {
        return ResponseEntity.ok(shiftService.save(dto));
    }

}
