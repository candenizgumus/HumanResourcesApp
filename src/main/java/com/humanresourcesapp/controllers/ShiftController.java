package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.ShiftSaveRequestDto;
import com.humanresourcesapp.dto.requests.ShiftUpdateRequestDto;
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
public class ShiftController {
    private final ShiftService shiftService;
    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    //TODO DAHA SONRA EMPLOYEE SİLCEZ
    public ResponseEntity<Shift> save(@RequestBody ShiftSaveRequestDto dto) {
        return ResponseEntity.ok(shiftService.save(dto));
    }

    @PostMapping(UPDATE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")

    public ResponseEntity<Shift> update(@RequestBody ShiftUpdateRequestDto dto) {
        return ResponseEntity.ok(shiftService.update(dto));
    }

    @DeleteMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")

    public ResponseEntity<Void> delete(Long id) {
        shiftService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER','EMPLOYEE')")
    public ResponseEntity<List<Shift>> getAll(Long employeeId) {
        return ResponseEntity.ok(shiftService.getAll(employeeId));
    }

}
