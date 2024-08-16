package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.ECompanyItemType;
import lombok.Builder;

@Builder
public record CompanyItemSaveRequestDto(
        String name,
        ECompanyItemType companyItemType,
        String serialNumber) {
}
