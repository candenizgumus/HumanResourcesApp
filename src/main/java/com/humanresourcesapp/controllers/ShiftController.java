package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.ShiftSaveRequestDto;
import com.humanresourcesapp.entities.Shift;
import com.humanresourcesapp.services.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+SHIFT)
@CrossOrigin("*")
public class ShiftController {
    private final ShiftService shiftService;
    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER','EMPLOYEE')")
    //TODO DAHA SONRA EMPLOYEE SİLCEZ
    public ResponseEntity<Shift> save(@RequestBody ShiftSaveRequestDto dto) {
        return ResponseEntity.ok(shiftService.save(dto));
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER','EMPLOYEE')")
    public ResponseEntity<List<Shift>> getAll(Long employeeId) {
        return ResponseEntity.ok(shiftService.getAll(employeeId));
    }

}
