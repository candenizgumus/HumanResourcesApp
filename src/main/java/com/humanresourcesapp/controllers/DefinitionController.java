package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.DefinitionSaveRequestDto;
import com.humanresourcesapp.entities.Definition;
import com.humanresourcesapp.entities.enums.EDefinitionType;
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
    @PostMapping(GET_ALL)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER','EMPLOYEE','ADMIN')")
    public ResponseEntity<List<Definition>> getAllByDefinitionType(@RequestBody EDefinitionType definitionType){
        return ResponseEntity.ok(definitionService.getAllByDefinitionType(definitionType));
    }

    @PostMapping(SAVE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN','MANAGER')")
    public ResponseEntity<Boolean> save(@RequestBody DefinitionSaveRequestDto dto){
        return ResponseEntity.ok(definitionService.save(dto));
    }


}
