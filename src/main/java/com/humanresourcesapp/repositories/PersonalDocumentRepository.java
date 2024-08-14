package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Payment;
import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalDocumentRepository extends JpaRepository<PersonalDocument, Long> {
    List<PersonalDocument> findByEmployeeId(Long employeeId);

    List<PersonalDocument> findByEmailContainingAndCompanyIdAndStatus(String email, Long companyId, EStatus status, PageRequest pageRequest);

}
