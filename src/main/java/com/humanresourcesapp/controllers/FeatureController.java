package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.FeatureSaveRequest;
import com.humanresourcesapp.entities.Feature;
import com.humanresourcesapp.services.FeatureService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+FEATURE)
@CrossOrigin("*")
public class FeatureController {
    private final FeatureService featureService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Feature> save(@RequestBody FeatureSaveRequest dto) {
        return ResponseEntity.ok(featureService.save(dto));
    }

    @GetMapping(GET_ALL)
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Feature>> getAll() {
        return ResponseEntity.ok(featureService.getAll());
    }
}
