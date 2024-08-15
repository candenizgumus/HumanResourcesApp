package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EDefinitionType;

public record DefinitionSaveRequestDto(EDefinitionType definitionType,
                                       String name) {
}
