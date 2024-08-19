package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.EDefinitionType;

public record DefinitionGetRequestDto(
        int page,
        int pageSize,
        String searchText,
        EDefinitionType definitionType

) {
}
