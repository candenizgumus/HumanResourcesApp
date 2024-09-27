package com.humanresourcesapp.controllers;

import static com.humanresourcesapp.constants.Endpoints.*;

import com.humanresourcesapp.dto.requests.BonusSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Bonus;
import com.humanresourcesapp.services.BonusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping(ROOT+BONUS)
@RestController
public class BonusController
{
    private final BonusService bonusService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> save(@RequestBody BonusSaveRequestDto dto)
    {
        return ResponseEntity.ok(bonusService.save(dto));
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<Bonus>> getAll(@RequestBody PageRequestDto dto)
    {
        return ResponseEntity.ok(bonusService.getAll(dto));
    }

    @PostMapping(GET_ALL_BONUSES_OF_EMPLOYEE)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<List<Bonus>> getAllBonusesOfEmployee(@RequestBody PageRequestDto dto)
    {
        return ResponseEntity.ok(bonusService.getAllBonusesOfEmployee(dto));
    }

    @DeleteMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> delete(Long id)
    {
        return ResponseEntity.ok(bonusService.delete(id));
    }
}
