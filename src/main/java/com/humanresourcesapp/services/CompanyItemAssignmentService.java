package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.CompanyItemAssignmentRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.responses.CompanyItemAssignmentResponseDto;
import com.humanresourcesapp.dto.responses.ItemAssignmentsOfEmployeeResponseDto;
import com.humanresourcesapp.entities.CompanyItem;
import com.humanresourcesapp.entities.CompanyItemAssignment;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.CompanyItemAssignmentRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class CompanyItemAssignmentService {
    private final CompanyItemAssignmentRepository companyItemAssignmentRepository;
    private final UserService userService;
    private final CompanyItemService companyItemService;


    public boolean save(CompanyItemAssignmentRequestDto dto) {
        User employee = userService.findById(dto.employeeId());
        companyItemAssignmentRepository.save(CompanyItemAssignment.builder()
                .companyId(employee.getCompanyId())
                .companyItemId(dto.companyItemId())
                .employeeId(dto.employeeId())
                .assignDate(LocalDate.now())
                .status(EStatus.PENDING)
                .build());

        return true;
    }

    public List<CompanyItemAssignmentResponseDto> getAllAssignments() {
        String managerEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(managerEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        List<CompanyItemAssignment> companyItemAssignments = companyItemAssignmentRepository.findByCompanyId(manager.getCompanyId());
        List<CompanyItem> companyItems = companyItemService.findByCompanyId(manager.getCompanyId());
        List <CompanyItemAssignmentResponseDto> dtoList = new ArrayList<>();
        for (CompanyItemAssignment companyItemAssignment : companyItemAssignments) {
            for (CompanyItem companyItem : companyItems) {
                if (companyItemAssignment.getCompanyItemId().equals(companyItem.getId())) {
                    CompanyItemAssignmentResponseDto dto = (new CompanyItemAssignmentResponseDto(
                            companyItemAssignment.getId(),
                            companyItem.getName(),
                            companyItem.getSerialNumber(),
                            userService.findById(companyItemAssignment.getEmployeeId()).getEmail(),
                            companyItemAssignment.getAssignDate(),
                            companyItemAssignment.getStatus(),
                            companyItemAssignment.getMessage()
                    ));
                    dtoList.add(dto);
                }
            }
        }
        return dtoList;
    }

    public Boolean approveAssignment(Long id, Long employeeId) {
        List<CompanyItemAssignment> companyItemAssignments = companyItemAssignmentRepository.findByEmployeeId(employeeId);
        for (CompanyItemAssignment companyItemAssignment : companyItemAssignments) {
            if (companyItemAssignment.getId().equals(id)) {
                companyItemAssignment.setStatus(EStatus.APPROVED);
                companyItemAssignment.setMessage("Approved");
                companyItemAssignmentRepository.save(companyItemAssignment);
                return true;
            }
        }
        companyItemService.findById(id).setStatus(EStatus.IN_USE);
        return false;
    }


    public List<ItemAssignmentsOfEmployeeResponseDto> getAssingedItemsOfEmployee() {
        String managerEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(managerEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        long id = 1L;
        List<ItemAssignmentsOfEmployeeResponseDto> dtoList = new ArrayList<>();

        List<CompanyItemAssignment> assignedItemList = companyItemAssignmentRepository.findByEmployeeIdAndStatus(employee.getId(), EStatus.APPROVED);


        for (CompanyItemAssignment companyItemAssignment : assignedItemList) {
            dtoList.add(new ItemAssignmentsOfEmployeeResponseDto(id,
                    companyItemService.findById(companyItemAssignment.getCompanyItemId()).getName(),
                    companyItemAssignment.getAssignDate()));

            id++;
        }


        return dtoList;
    }

}
