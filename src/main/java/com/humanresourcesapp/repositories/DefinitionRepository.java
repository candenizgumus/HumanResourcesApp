package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Definition;
import com.humanresourcesapp.entities.enums.EDefinitionType;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DefinitionRepository extends JpaRepository<Definition, Long> {
    Optional<Definition> findByName(String name);

    List<Definition> findAllByDefinitionType(EDefinitionType definitionType);

    List<Definition> findAllByDefinitionTypeAndStatusAndCompanyIdIsNull(EDefinitionType definitionType, EStatus status);

    List<Definition> findAllByDefinitionTypeAndStatusAndCompanyId(EDefinitionType definitionType, EStatus status, Long companyId);

    Optional<Definition> findByNameAndDefinitionType(String name, EDefinitionType eDefinitionType);
}
