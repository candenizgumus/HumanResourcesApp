package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.DefinitionSaveRequestDto;
import com.humanresourcesapp.entities.definitions.DLeaveType;
import com.humanresourcesapp.services.DefinitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+"/definition")
@CrossOrigin("*")
public class DefinitionController {
    private final DefinitionService definitionService;
    @PostMapping(GET_LEAVE_TYPES)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER','EMPLOYEE','ADMIN')")
    public ResponseEntity<List<DLeaveType>> getLeaveTypes(){
        return ResponseEntity.ok(definitionService.getAll());
    }

    @PostMapping(SAVE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Boolean> save(@RequestBody DefinitionSaveRequestDto dto){
        return ResponseEntity.ok(definitionService.save(dto));
    }


}
