package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.repositories.PersonalDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonalDocumentService {
    private final PersonalDocumentRepository personalDocumentRepository;

    public PersonalDocument save(PersonalDocument personalDocument) {
        return personalDocumentRepository.save(personalDocument);
    }
}
