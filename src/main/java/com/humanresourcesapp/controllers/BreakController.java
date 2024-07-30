package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.BreakSaveRequestDto;
import com.humanresourcesapp.dto.responses.BreakSaveResponseDto;
import com.humanresourcesapp.entities.Break;
import com.humanresourcesapp.services.BreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/breaks")
@CrossOrigin("*")
public class BreakController {
    private final BreakService breakService;

    @PostMapping("/save")
    public ResponseEntity<BreakSaveResponseDto> save(BreakSaveRequestDto dto) {
        return ResponseEntity.ok(breakService.save(dto));
    }

}
