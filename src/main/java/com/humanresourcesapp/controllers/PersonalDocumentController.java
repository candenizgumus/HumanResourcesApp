package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.DeletePersonalDocumentRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.PersonalDocumentSaveRequestDto;
import com.humanresourcesapp.dto.responses.PersonalDocumentResponseDto;
import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.entities.enums.EDocumentType;
import com.humanresourcesapp.services.PersonalDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<PersonalDocument> save(@RequestParam("employeeId") String employeeId,
                                                 @RequestParam("documentType") String documentType,
                                                 @Nullable @RequestParam("documentFile") List<MultipartFile> documentFile,
                                                 @RequestParam("description") String description) {
        return ResponseEntity.ok(personalDocumentService.save(employeeId, documentType, documentFile, description));
    }

    @PostMapping(GET_BY_EMPLOYEE_ID)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<PersonalDocument>> getByEmployeeId(Long employeeId) {
        return ResponseEntity.ok(personalDocumentService.getByEmployeeId(employeeId));
    }

    @PostMapping(GET_ALL_PERSONAL_DOCUMENT_TYPES)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<EDocumentType[]> getAllPersonalDocumentTypes() {
        return ResponseEntity.ok(EDocumentType.values());
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<PersonalDocument>> getAll(@RequestBody PageRequestDto dto) {
        return ResponseEntity.ok(personalDocumentService.getAllByEmail(dto));
    }

    @DeleteMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<PersonalDocument> deletePersonalDocument(@RequestBody DeletePersonalDocumentRequestDto dto) {
        PersonalDocument deletedDocument = personalDocumentService.delete(dto.id());
        personalDocumentService.deleteFromBucket(dto.attachedFile());
        return ResponseEntity.ok(deletedDocument);
    }

}
