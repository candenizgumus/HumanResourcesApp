package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.PersonalDocumentSaveRequestDto;
import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.PersonalDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonalDocumentService {
    private final PersonalDocumentRepository personalDocumentRepository;

    public PersonalDocument save(PersonalDocumentSaveRequestDto personalDocumentSaveRequestDto) {
        return personalDocumentRepository.save(PersonalDocument.builder()
                .documentType(personalDocumentSaveRequestDto.documentType())
                .employeeId(personalDocumentSaveRequestDto.employeeId())
                .documentFile(personalDocumentSaveRequestDto.documentFile())
                .build());
    }

    public PersonalDocument delete(Long personalDocumentId) {
        Optional<PersonalDocument> optionalPersonalDocument = personalDocumentRepository.findById(personalDocumentId);
        if (optionalPersonalDocument.isPresent()) {
            personalDocumentRepository.delete(optionalPersonalDocument.get());
            return optionalPersonalDocument.get();
        } else {
            throw new HumanResourcesAppException(ErrorType.ID_NOT_FOUND);
        }
    }

    public PersonalDocument update(Long personalDocumentId, PersonalDocumentSaveRequestDto personalDocumentSaveRequestDto) {
        Optional<PersonalDocument> optionalPersonalDocument = personalDocumentRepository.findById(personalDocumentId);
        if (optionalPersonalDocument.isPresent()) {
            PersonalDocument personalDocument = optionalPersonalDocument.get();
            personalDocument.setDocumentType(personalDocumentSaveRequestDto.documentType());
            personalDocument.setEmployeeId(personalDocumentSaveRequestDto.employeeId());
            personalDocument.setDocumentFile(personalDocumentSaveRequestDto.documentFile());
            return personalDocumentRepository.save(personalDocument);
        } else {
            throw new HumanResourcesAppException(ErrorType.ID_NOT_FOUND);
        }
    }

    public List<PersonalDocument> getAll() {
        return personalDocumentRepository.findAll();
    }
}
