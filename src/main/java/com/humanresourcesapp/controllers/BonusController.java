package com.humanresourcesapp.controllers;

import static com.humanresourcesapp.constants.Endpoints.*;

import com.humanresourcesapp.dto.requests.BonusSaveRequestDto;
import com.humanresourcesapp.services.BonusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping(ROOT+BONUS)
@RestController
@CrossOrigin("*")
public class BonusController
{
    private final BonusService bonusService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> save(BonusSaveRequestDto dto)
    {
        return ResponseEntity.ok(bonusService.save(dto));
    }
}
