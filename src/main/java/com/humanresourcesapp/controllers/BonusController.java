package com.humanresourcesapp.controllers;

import static com.humanresourcesapp.constants.Endpoints.*;

import com.humanresourcesapp.dto.requests.BonusSaveRequestDto;
import com.humanresourcesapp.services.BonusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping(ROOT+BONUS)
@RestController
@CrossOrigin("*")
public class BonusController
{
    private final BonusService bonusService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> save(@RequestBody BonusSaveRequestDto dto)
    {
        return ResponseEntity.ok(bonusService.save(dto));
    }
}
