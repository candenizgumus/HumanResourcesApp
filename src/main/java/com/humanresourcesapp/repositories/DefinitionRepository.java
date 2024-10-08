package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Definition;
import com.humanresourcesapp.entities.enums.EDefinitionType;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DefinitionRepository extends JpaRepository<Definition, Long> {
    Optional<Definition> findByName(String name);

    List<Definition> findAllByDefinitionType(EDefinitionType definitionType);

    List<Definition> findAllByDefinitionTypeAndStatusAndCompanyIdIsNullOrderByNameAsc(EDefinitionType definitionType, EStatus status);

    List<Definition> findAllByDefinitionTypeAndStatusAndCompanyIdIsNullAndNameContainingIgnoreCaseOrderByNameAsc(EDefinitionType definitionType, EStatus status,String name, PageRequest of);

    List<Definition> findAllByDefinitionTypeAndStatusAndCompanyIdOrderByNameAsc(EDefinitionType definitionType, EStatus status, Long companyId);
    List<Definition> findAllByDefinitionTypeAndStatusAndCompanyIdAndNameContainingIgnoreCaseOrderByNameAsc(EDefinitionType definitionType, EStatus status, Long companyId, String name, PageRequest of);

    List<Definition> findAllByNameAndDefinitionType(String name, EDefinitionType eDefinitionType);
}
