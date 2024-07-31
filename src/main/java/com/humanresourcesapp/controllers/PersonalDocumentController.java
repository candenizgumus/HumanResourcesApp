package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.PersonalDocumentSaveRequestDto;
import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.services.PersonalDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT + PERSONAL_DOCUMENT)
public class PersonalDocumentController {
    private final PersonalDocumentService personalDocumentService;

    @PostMapping(SAVE)
    public ResponseEntity<PersonalDocument> save(PersonalDocumentSaveRequestDto personalDocumentSaveRequestDto) {
        return ResponseEntity.ok(personalDocumentService.save(personalDocumentSaveRequestDto));
    }

    @PostMapping(DELETE + "/{personalDocumentId}")
    public ResponseEntity<PersonalDocument> delete(@PathVariable Long personalDocumentId) {
        return ResponseEntity.ok(personalDocumentService.delete(personalDocumentId));
    }

    @PostMapping(UPDATE)
    public ResponseEntity<PersonalDocument> update(Long personalDocumentId, PersonalDocumentSaveRequestDto personalDocumentSaveRequestDto) {
        return ResponseEntity.ok(personalDocumentService.update(personalDocumentId, personalDocumentSaveRequestDto));
    }
}
