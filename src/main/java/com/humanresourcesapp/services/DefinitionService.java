package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.DefinitionSaveRequestDto;
import com.humanresourcesapp.entities.Definition;
import com.humanresourcesapp.entities.enums.EDefinitionType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.DefinitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DefinitionService {
    private final DefinitionRepository definitionRepository;


    public Definition findById(Long id) {
        return definitionRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.DEFINITION_NOT_FOUND));
    }

    public Boolean save(DefinitionSaveRequestDto dto) {
        definitionRepository.findByName(dto.name()).ifPresent(definition -> {
            throw new HumanResourcesAppException(ErrorType.DEFINITION_ALREADY_EXISTS);
        });
        definitionRepository.save(Definition.builder()
                        .definitionType(dto.definitionType())
                        .name(dto.name())
                .build());
        return true;
    }

    public Definition findByName(String name) {
        return definitionRepository.findByName(name).orElseThrow(() -> new HumanResourcesAppException(ErrorType.DEFINITION_NOT_FOUND));
    }


    public List<Definition> getAllByDefinitionType(EDefinitionType definitionType) {

        return definitionRepository.findAllByDefinitionType(definitionType);
    }

    public Boolean saveLeaveType(Definition definition) {
        definitionRepository.save(definition);
        return true;
    }
}
