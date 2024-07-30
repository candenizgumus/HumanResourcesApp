package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.services.PersonalDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+PERSONAL_DOCUMENT)
public class PersonalDocumentController {
    private final PersonalDocumentService personalDocumentService;

    @PostMapping(SAVE)
    public ResponseEntity<PersonalDocument> save(PersonalDocument personalDocument) {
        return ResponseEntity.ok(personalDocumentService.save(personalDocument));
    }
}
