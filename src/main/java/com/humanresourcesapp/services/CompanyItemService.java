package com.humanresourcesapp.services;


import com.humanresourcesapp.dto.requests.CompanyItemSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.CompanyItem;
import com.humanresourcesapp.entities.CompanyItemAssignment;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.ECompanyItemType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.CompanyItemRepository;
import com.humanresourcesapp.utility.JwtTokenManager;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CompanyItemService {

    private final CompanyItemRepository companyItemRepository;
    private final UserService userService;
    private CompanyItemAssignmentService companyItemAssignmentService;

    @Autowired
    public void setCompanyItemAssignmentService(@Lazy CompanyItemAssignmentService companyItemAssignmentService) {
        this.companyItemAssignmentService = companyItemAssignmentService;
    }

    public CompanyItem save(CompanyItemSaveRequestDto dto) {
        String managerEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        Optional<User> manager = userService.findByEmail(managerEmail);
        List<CompanyItem> allCompanyItems = companyItemRepository.findAll();
        for (CompanyItem companyItem : allCompanyItems) {
            if (companyItem.getSerialNumber().equals(dto.serialNumber())) {
                throw new HumanResourcesAppException(ErrorType.ITEM_ALREADY_EXISTS);
            }
        }
        return companyItemRepository.save(
                CompanyItem.builder()
                        .companyId(manager.get().getCompanyId())
                        .name(dto.name())
                        .serialNumber(dto.serialNumber())
                        .companyItemType(dto.companyItemType())
                        .status(EStatus.AVAILABLE)
                        .build()
        );
    }

    public void saveForStatus(CompanyItem companyItem) {
        //Only for status update
        companyItemRepository.save(companyItem);
    }

    public CompanyItem saveForDemoData(CompanyItemSaveRequestDto dto) {

        List<CompanyItem> allCompanyItems = companyItemRepository.findAll();
        for (CompanyItem companyItem : allCompanyItems) {
            if (companyItem.getSerialNumber().equals(dto.serialNumber())) {
                throw new HumanResourcesAppException(ErrorType.ITEM_ALREADY_EXISTS);
            }
        }
        return companyItemRepository.save(
                CompanyItem.builder()
                        .companyId(1L)
                        .name(dto.name())
                        .serialNumber(dto.serialNumber())
                        .companyItemType(dto.companyItemType())
                        .status(EStatus.AVAILABLE)
                        .build()
        );
    }

    public List<CompanyItem> findAllBySerialNumber(PageRequestDto dto) {
        String managerEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(managerEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        List<CompanyItem> companyItems = companyItemRepository.findBySerialNumberContainingAndCompanyId(dto.searchText(), manager.getCompanyId(), PageRequest.of(dto.page(), dto.pageSize()));
        companyItems.removeIf(companyItem -> companyItem.getStatus().equals(EStatus.DELETED));

        return companyItems;
    }

    public List<CompanyItem> findAllForAssignment(PageRequestDto dto) {
        String managerEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(managerEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        List<CompanyItem> companyItems = companyItemRepository.findBySerialNumberContainingAndCompanyId(dto.searchText(), manager.getCompanyId(), PageRequest.of(dto.page(), dto.pageSize()));
        List<CompanyItem> availableItems = new ArrayList<>();
        for (CompanyItem companyItem : companyItems) {
            if (companyItem.getStatus().equals(EStatus.AVAILABLE)) {
                availableItems.add(companyItem);
            }
        }
        return availableItems;
    }

    public List<String> getCompanyItemTypes() {
        List<String> companyItemTypes = new ArrayList<>();
        for (ECompanyItemType type : ECompanyItemType.values()) {
            companyItemTypes.add(type.name());
        }
        return companyItemTypes;
    }

    public CompanyItem delete(Long id) {
        CompanyItem companyItem = companyItemRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.ITEM_NOT_FOUND));
        companyItem.setStatus(EStatus.DELETED);
        CompanyItemAssignment companyItemAssignment = companyItemAssignmentService.findByCompanyItemId(companyItem.getId());
        companyItemAssignment.setStatus(EStatus.DELETED);
        companyItemAssignmentService.update(companyItemAssignment);
        return companyItemRepository.save(companyItem);
    }

    public CompanyItem findById(Long id) {
        return companyItemRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.ITEM_NOT_FOUND));
    }

    public List<CompanyItem> findAll() {
        return companyItemRepository.findAll();
    }

    public List<CompanyItem> findByCompanyId(Long companyId) {
        return companyItemRepository.findByCompanyId(companyId);
    }


}
