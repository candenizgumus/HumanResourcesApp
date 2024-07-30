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

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+BREAK)
@CrossOrigin("*")
public class BreakController {
    private final BreakService breakService;

    @PostMapping(SAVE)
    public ResponseEntity<BreakSaveResponseDto> save(BreakSaveRequestDto dto) {
        return ResponseEntity.ok(breakService.save(dto));
    }

}
