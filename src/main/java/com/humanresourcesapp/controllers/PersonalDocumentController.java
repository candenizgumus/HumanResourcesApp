package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.PersonalDocumentSaveRequestDto;
import com.humanresourcesapp.dto.responses.PersonalDocumentResponseDto;
import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.entities.enums.EDocumentType;
import com.humanresourcesapp.services.PersonalDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT + PERSONAL_DOCUMENT)
@CrossOrigin("*")
public class PersonalDocumentController {
    private final PersonalDocumentService personalDocumentService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<PersonalDocument> save(@RequestBody PersonalDocumentSaveRequestDto personalDocumentSaveRequestDto) {
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

    @PostMapping(GET_ALL_PERSONAL_DOCUMENT_TYPES)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<EDocumentType[]> getAllPersonalDocumentTypes() {
        return ResponseEntity.ok(EDocumentType.values());
    }
}
