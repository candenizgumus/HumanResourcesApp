package com.humanresourcesapp.services;

import com.humanresourcesapp.configs.aws.S3Buckets;
import com.humanresourcesapp.constants.ENotificationTextBase;
import com.humanresourcesapp.dto.requests.AssignLeaveRequestDto;
import com.humanresourcesapp.dto.requests.LeaveSaveRequestDto;
import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Leave;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.LeaveRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.humanresourcesapp.constants.FrontendPaths.EXPENDITURE;
import static com.humanresourcesapp.constants.FrontendPaths.LEAVES;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private UserService userService;
    private final NotificationService notificationService;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final DefinitionService definitionService;
    //To break circular reference in UserService
    @Autowired
    public void setUserService(@Lazy UserService userService) {
        this.userService = userService;
    }

    public Boolean save(LeaveSaveRequestDto dto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        String fileName = "";
        if (dto.files() != null && !dto.files().isEmpty()) {
            for (MultipartFile file : dto.files()) {
                fileName = employee.getEmail()+"/"+file.getOriginalFilename();
                byte[] fileContent;
                try {
                    fileContent = file.getBytes();
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read file content", e);
                }
                s3Service.putObject(s3Buckets.getCustomer(),
                        "personelDocuments/%s".formatted( fileName),
                        fileContent);
            }
        }

        leaveRepository.save(Leave.builder()
                        .description(dto.description())
                        .employeeId(employee.getId())
                        .employeeName(employee.getName())
                        .employeeSurname(employee.getSurname())
                        .companyId(employee.getCompanyId())
                        .dLeaveTypeId(dto.dLeaveTypeId())
                        .startDate(dto.startDate().plusDays(1))
                        .endDate(dto.endDate().plusDays(1))
                        .fullName(employee.getName() + " " + employee.getSurname())
                        .email(employee.getEmail())
                        .attachedFile(fileName)
                .build());

        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.LEAVE_REQUEST_NOTIFICATION.getText() + userEmail)
                .userType(EUserType.MANAGER)
                .userId(null)
                .companyId(employee.getCompanyId())
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.WARNING)
                .url(LEAVES)
                .build());
        return true;
    }

    public Boolean approveLeaveRequest(Long id) {
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        Leave leave = leaveRepository.findById(id).orElseThrow(()-> new HumanResourcesAppException(ErrorType.LEAVE_NOT_FOUND));
        if (!leave.getCompanyId().equals(manager.getCompanyId()))
        {
            throw new HumanResourcesAppException(ErrorType.INVALID_ACCOUNT);
        }

        if (!leave.getIsLeaveApproved())
        {
            if(leave.getDLeaveTypeId().equals(definitionService.findByName("ANNUAL").getId())){
                User employee = userService.findById(leave.getEmployeeId());
                if(employee.getRemainingAnnualLeave() < ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate())){
                    throw new HumanResourcesAppException(ErrorType.ANNUAL_LEAVE_EXCEEDED);
                }else {
                    employee.setRemainingAnnualLeave(employee.getRemainingAnnualLeave() -(int) ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()));
                    userService.save(employee);
                }
            }
            leave.setIsLeaveApproved(true);
            leave.setApproveDate(LocalDate.now());
            leave.setStatus(EStatus.ACTIVE);
            leaveRepository.save(leave);

            notificationService.save(NotificationSaveRequestDto.builder()
                    .notificationText(ENotificationTextBase.LEAVE_APPROVE_NOTIFICATION.getText() + leave.getDescription())
                    .userType(null)
                    .userId(leave.getEmployeeId())
                    .isRead(false)
                    .status(EStatus.ACTIVE)
                    .notificationType(ENotificationType.SUCCESS)
                    .url(EXPENDITURE)
                    .build());
            return true;
        }
        return false;
    }

    public List<Leave> searchByEmployeeId(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        return leaveRepository.searchByEmployeeId(dto.searchText(), employee.getId(), PageRequest.of(dto.page(), dto.pageSize()));
    }


    public List<Leave> searchByCompanyId(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        return leaveRepository.searchByCompanyId(dto.searchText(), manager.getCompanyId(), PageRequest.of(dto.page(), dto.pageSize()));

    }

    public Boolean delete(Long id)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        Leave leave = leaveRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.LEAVE_NOT_FOUND));

        if (leave.getIsLeaveApproved())
        {
            throw new HumanResourcesAppException(ErrorType.LEAVE_ALREADY_APPROVED);
        }

        // if the delete request comes from employee, it can be deleted
        if(user.getId().equals(leave.getEmployeeId())){
            leave.setStatus(EStatus.DELETED);
            leaveRepository.save(leave);
            return true;
        }
        // if the delete request comes from manager, it is actually a decline request
        leave.setStatus(EStatus.DECLINED);
        leaveRepository.save(leave);

        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.LEAVE_REJECT_NOTIFICATION.getText() + leave.getDescription())
                .userType(null)
                .userId(leave.getEmployeeId())
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.WARNING)
                .url(LEAVES)
                .build());
        return true;
    }

    public Boolean cancel(Long id) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        Leave leave = leaveRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.LEAVE_NOT_FOUND));

        // if the leave is approved, it can be canceled
        if (leave.getIsLeaveApproved()) {

            // If the cancel comes from employee
            if (user.getId().equals(leave.getEmployeeId())) {
                notificationService.save(NotificationSaveRequestDto.builder()
                        .notificationText(ENotificationTextBase.LEAVE_CANCEL_NOTIFICATION.getText() + leave.getDescription())
                        .userType(EUserType.MANAGER)
                        .userId(null)
                        .companyId(user.getCompanyId())
                        .isRead(false)
                        .status(EStatus.ACTIVE)
                        .notificationType(ENotificationType.WARNING)
                        .url(LEAVES)
                        .build());
            }else { // If the cancel comes from manager
                notificationService.save(NotificationSaveRequestDto.builder()
                        .notificationText(ENotificationTextBase.LEAVE_CANCEL_NOTIFICATION.getText() + leave.getDescription())
                        .userType(null)
                        .userId(leave.getEmployeeId())
                        .companyId(null)
                        .isRead(false)
                        .status(EStatus.ACTIVE)
                        .notificationType(ENotificationType.WARNING)
                        .url(LEAVES)
                        .build());
            }
            leave.setStatus(EStatus.CANCELED);
            // if the leave is not approved, it can not be canceled, and it will be deleted or rejected
        }else {
            delete(id);
            return true;
        }

        leaveRepository.save(leave);
        return true;
    }

    public Boolean changeLeaveDay(Long id, Integer leaveDay) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        User user = userService.findById(id);

        if(!user.getCompanyId().equals(manager.getCompanyId())){
            throw new HumanResourcesAppException(ErrorType.INSUFFICIENT_PERMISSION);
        }
        user.setRemainingAnnualLeave(leaveDay);
        userService.save(user);
        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.ANNUAL_LEAVE_CHANGE.getText() + leaveDay)
                .userType(null)
                .userId(user.getId())
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.WARNING)
                .url(LEAVES)
                .build());
        return true;
    }

    public Boolean assignLeave(AssignLeaveRequestDto dto) {
        String managerEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(managerEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        User employee = userService.findById(dto.employeeId());
        if(!employee.getCompanyId().equals(manager.getCompanyId())){
            throw new HumanResourcesAppException(ErrorType.INSUFFICIENT_PERMISSION);
        }

        String fileName = "";
        if (dto.files() != null && !dto.files().isEmpty()) {
            for (MultipartFile file : dto.files()) {
                fileName = employee.getEmail()+"/"+file.getOriginalFilename();
                byte[] fileContent;
                try {
                    fileContent = file.getBytes();
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read file content", e);
                }
                s3Service.putObject(s3Buckets.getCustomer(),
                        "personelDocuments/%s".formatted( fileName),
                        fileContent);
            }
        }

        leaveRepository.save(Leave.builder()
                .description(dto.description())
                .employeeId(employee.getId())
                .employeeName(employee.getName())
                .employeeSurname(employee.getSurname())
                .companyId(employee.getCompanyId())
                .dLeaveTypeId(dto.dLeaveTypeId())
                .startDate(dto.startDate().plusDays(1))
                .endDate(dto.endDate().plusDays(1))
                .approveDate(LocalDate.now())
                .isLeaveApproved(true)
                .status(EStatus.ACTIVE)
                .attachedFile(fileName)
                .fullName(employee.getName() + " " + employee.getSurname())
                .email(employee.getEmail())
                .build());

        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.LEAVE_APPROVE_NOTIFICATION.getText() + dto.description())
                .userType(null)
                .userId(employee.getId())
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.INFORMATION)
                .url(LEAVES)
                .build());
        return true;
    }

    // TODO Update Leaves
}




