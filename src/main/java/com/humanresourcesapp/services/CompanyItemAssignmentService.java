package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.CompanyItemAssignmentRequestDto;
import com.humanresourcesapp.dto.requests.EmployeeRejectAssignmentRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.responses.CompanyItemAssignmentEmployeeResponseDto;
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
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class CompanyItemAssignmentService {
    private final CompanyItemAssignmentRepository companyItemAssignmentRepository;
    private final UserService userService;
    private final CompanyItemService companyItemService;


    public boolean save(CompanyItemAssignmentRequestDto dto) {
        List<CompanyItemAssignment> companyItemAssignments = companyItemAssignmentRepository.findAll();
        for (CompanyItemAssignment companyItemAssignment : companyItemAssignments) {
            if ((companyItemAssignment.getStatus().equals(EStatus.APPROVED) || companyItemAssignment.getStatus().equals(EStatus.PENDING))
                    && companyItemAssignment.getCompanyItemId().equals(dto.companyItemId())
                    && companyItemAssignment.getEmployeeId().equals(dto.employeeId())) {
                throw new HumanResourcesAppException(ErrorType.ASSIGNMENT_ALREADY_EXISTS);
            }
        }
        User employee = userService.findById(dto.employeeId());
        companyItemAssignmentRepository.save(CompanyItemAssignment.builder()
                .companyId(employee.getCompanyId())
                .companyItemId(dto.companyItemId())
                .employeeId(dto.employeeId())
                .assignDate(LocalDate.now())
                .status(EStatus.PENDING)
                .build());

        companyItemService.findById(dto.companyItemId()).setStatus(EStatus.PENDING);
        companyItemService.saveForStatus(companyItemService.findById(dto.companyItemId()));
        return true;
    }

    public void update (CompanyItemAssignment companyItemAssignment) {
        companyItemAssignmentRepository.save(companyItemAssignment);
    }

    public boolean saveForDemoData(Long companyItemId, Long employeeId) {
        User employee = userService.findById(employeeId);
        companyItemAssignmentRepository.save(CompanyItemAssignment.builder()
                .companyId(employee.getCompanyId())
                .companyItemId(companyItemId)
                .employeeId(employeeId)
                .assignDate(LocalDate.now())
                .status(EStatus.APPROVED)
                .build());

        CompanyItem companyItem = companyItemService.findById(companyItemId);
        companyItem.setStatus(EStatus.IN_USE);
        companyItemService.saveForStatus(companyItem);
        return true;
    }

    public List<CompanyItemAssignmentResponseDto> getAllAssignments() {
        String managerEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(managerEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        List<CompanyItemAssignment> companyItemAssignments = companyItemAssignmentRepository.findByCompanyIdAndStatusNot(manager.getCompanyId(), EStatus.DELETED);
        List<CompanyItem> companyItems = companyItemService.findByCompanyId(manager.getCompanyId());
        List<CompanyItemAssignmentResponseDto> dtoList = new ArrayList<>();
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

    public Boolean approveAssignment(Long id) {
        Optional<CompanyItemAssignment> companyItemAssignment = companyItemAssignmentRepository.findById(id);
        if (companyItemAssignment.isPresent()) {
            companyItemAssignment.get().setStatus(EStatus.APPROVED);
            companyItemAssignment.get().setMessage("Approved");
            companyItemAssignmentRepository.save(companyItemAssignment.get());
            companyItemService.findById(id).setStatus(EStatus.IN_USE);
            companyItemService.saveForStatus(companyItemService.findById(id));
            return true;
        }
        throw new HumanResourcesAppException(ErrorType.ASSIGNMENT_NOT_FOUND);
    }

    public Boolean rejectAssignment(EmployeeRejectAssignmentRequestDto dto) {
        Optional<CompanyItemAssignment> companyItemAssignment = companyItemAssignmentRepository.findById(dto.id());
        if (companyItemAssignment.isPresent()) {
            companyItemAssignment.get().setStatus(EStatus.REJECTED);
            companyItemAssignment.get().setMessage(dto.message());
            companyItemAssignmentRepository.save(companyItemAssignment.get());
            return true;
        }
        throw new HumanResourcesAppException(ErrorType.ASSIGNMENT_NOT_FOUND);
    }


    public List<ItemAssignmentsOfEmployeeResponseDto> getAssignedItemsOfEmployee() {
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

    public List<CompanyItemAssignmentEmployeeResponseDto> getAllAssignmentsByEmployee() {
        String managerEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(managerEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        List<CompanyItemAssignment> companyItemAssignments = companyItemAssignmentRepository.findByEmployeeId(employee.getId());
        List<CompanyItem> companyItems = companyItemService.findByCompanyId(userService.findById(employee.getId()).getCompanyId());
        List<CompanyItemAssignmentEmployeeResponseDto> dtoList = new ArrayList<>();
        for (CompanyItemAssignment companyItemAssignment : companyItemAssignments) {
            for (CompanyItem companyItem : companyItems) {
                if (companyItemAssignment.getCompanyItemId().equals(companyItem.getId()) && (companyItemAssignment.getStatus().equals(EStatus.PENDING) || companyItemAssignment.getStatus().equals(EStatus.APPROVED))) {
                    CompanyItemAssignmentEmployeeResponseDto dto = (new CompanyItemAssignmentEmployeeResponseDto(
                            companyItemAssignment.getId(),
                            companyItem.getName(),
                            companyItem.getSerialNumber(),
                            companyItemAssignment.getAssignDate(),
                            companyItemAssignment.getStatus()
                    ));
                    dtoList.add(dto);
                }
            }
        }
        return dtoList;
    }


    public Boolean cancelAssignmentByManager(Long id) {
        Optional<CompanyItemAssignment> companyItemAssignment = companyItemAssignmentRepository.findById(id);
        if (companyItemAssignment.isPresent()) {
            companyItemAssignment.get().setStatus(EStatus.CANCELED);
            companyItemAssignment.get().setMessage("Canceled by Manager");
            companyItemAssignmentRepository.save(companyItemAssignment.get());
            companyItemService.findById(id).setStatus(EStatus.AVAILABLE);
            companyItemService.saveForStatus(companyItemService.findById(id));
            return true;
        }
        throw new HumanResourcesAppException(ErrorType.ASSIGNMENT_NOT_FOUND);
    }

    public CompanyItemAssignment findByCompanyItemId(Long id) {
        Optional<CompanyItemAssignment> companyItemAssignment = companyItemAssignmentRepository.findByCompanyItemId(id);
        if (companyItemAssignment.isPresent()) {
            return companyItemAssignment.get();
        }
        throw new HumanResourcesAppException(ErrorType.ASSIGNMENT_NOT_FOUND);
    }
}
