package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.PersonalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalDocumentRepository extends JpaRepository<PersonalDocument, Long> {
}
