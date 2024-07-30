package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.services.PersonalDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/personaldocument")
public class PersonalDocumentController {
    private final PersonalDocumentService personalDocumentService;

    @PostMapping("/save")
    public ResponseEntity<PersonalDocument> save(PersonalDocument personalDocument) {
        return ResponseEntity.ok(personalDocumentService.save(personalDocument));
    }
}
