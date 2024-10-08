package com.humanresourcesapp.services;

import com.humanresourcesapp.configs.aws.S3Buckets;
import com.humanresourcesapp.constants.ENotificationTextBase;
import com.humanresourcesapp.dto.requests.ExpenditureSaveRequestDto;
import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Expenditure;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.ExpenditureRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import static com.humanresourcesapp.constants.FrontendPaths.EXPENDITURE;

@Service
@RequiredArgsConstructor
public class ExpenditureService {
    private final ExpenditureRepository expenditureRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    @Value("${AWS_BUCKET_NAME}")
    private String bucketName;

    public Expenditure save(ExpenditureSaveRequestDto dto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        // Saving file
        String fileName = "";

        if (dto.files() != null && !dto.files().isEmpty()) {
            for (MultipartFile file : dto.files()) {
                fileName = employee.getEmail()+"/"+file.getOriginalFilename();
                byte[] fileContent;
                String key;
                try {
                    fileContent = file.getBytes();
                    key = "personelDocuments/%s".formatted(fileName);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read file content", e);
                }
                s3Service.putObject(s3Buckets.getCustomer(),
                        key,
                        fileContent);
            }
        }

        Expenditure expenditure = Expenditure
                .builder()
                .employeeId(employee.getId())
                .description(dto.description())
                .price(dto.price())
                .companyId(employee.getCompanyId())
                .employeeName(employee.getName())
                .employeeSurname(employee.getSurname())
                .status(EStatus.PENDING)
                .attachedFile(fileName)
                .build();


        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.EXPENDITURE_REQUEST_NOTIFICATION.getText() + userEmail)
                .userType(null)
                .userId(null)
                .companyId(employee.getCompanyId())
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.WARNING)
                .url(EXPENDITURE)
                .build());

        return expenditureRepository.save(expenditure);
    }

    public Expenditure saveForDemoData(ExpenditureSaveRequestDto dto) {




        Expenditure expenditure = Expenditure
                .builder()
                .employeeId(7L)
                .description(dto.description())
                .price(dto.price())
                .companyId(1L)
                .employeeName("Employee 1")
                .employeeSurname("Hard")
                .status(EStatus.PENDING)
                .attachedFile("")
                .build();


        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.EXPENDITURE_REQUEST_NOTIFICATION.getText() + "employee@gmail.com")
                .userType(null)
                .userId(null)
                .companyId(1L)
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.WARNING)
                .url(EXPENDITURE)
                .build());

        return expenditureRepository.save(expenditure);
    }

    public List<Expenditure> searchByEmployeeId(PageRequestDto dto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        return expenditureRepository.searchByEmployeeId(dto.searchText(), employee.getId(), PageRequest.of(dto.page(), dto.pageSize()));
    }


    public List<Expenditure> searchByCompanyId(PageRequestDto dto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        return expenditureRepository.searchByCompanyId(dto.searchText(), manager.getCompanyId(), PageRequest.of(dto.page(), dto.pageSize()));
    }

    public Boolean approveExpenditure(Long id) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        Expenditure expenditure = expenditureRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.EXPENDITURE_NOT_FOUND));
        if (!expenditure.getCompanyId().equals(manager.getCompanyId())) {
            throw new HumanResourcesAppException(ErrorType.INVALID_ACCOUNT);
        }

        if (!expenditure.getIsExpenditureApproved()) {
            expenditure.setIsExpenditureApproved(true);
            expenditure.setApproveDate(LocalDate.now());
            expenditure.setStatus(EStatus.ACTIVE);
            expenditureRepository.save(expenditure);

            notificationService.save(NotificationSaveRequestDto.builder()
                    .notificationText(ENotificationTextBase.EXPENDITURE_APPROVE_NOTIFICATION.getText() + expenditure.getDescription())
                    .userType(null)
                    .userId(expenditure.getEmployeeId())
                    .isRead(false)
                    .status(EStatus.ACTIVE)
                    .notificationType(ENotificationType.SUCCESS)
                    .url(EXPENDITURE)
                    .build());
            return true;
        }
        return false;
    }

    public Boolean approveExpenditureForDemoData(Long id) {


        Expenditure expenditure = expenditureRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.EXPENDITURE_NOT_FOUND));
        if (!expenditure.getCompanyId().equals(1L)) {
            throw new HumanResourcesAppException(ErrorType.INVALID_ACCOUNT);
        }

        if (!expenditure.getIsExpenditureApproved()) {
            expenditure.setIsExpenditureApproved(true);
            expenditure.setApproveDate(LocalDate.now());
            expenditure.setStatus(EStatus.ACTIVE);
            expenditureRepository.save(expenditure);

            notificationService.save(NotificationSaveRequestDto.builder()
                    .notificationText(ENotificationTextBase.EXPENDITURE_APPROVE_NOTIFICATION.getText() + expenditure.getDescription())
                    .userType(null)
                    .userId(expenditure.getEmployeeId())
                    .isRead(false)
                    .status(EStatus.ACTIVE)
                    .notificationType(ENotificationType.SUCCESS)
                    .url(EXPENDITURE)
                    .build());
            return true;
        }
        return false;
    }

    public Boolean delete(Long id) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        Expenditure expenditure = expenditureRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.EXPENDITURE_NOT_FOUND));

        if (expenditure.getIsExpenditureApproved()) {
            throw new HumanResourcesAppException(ErrorType.EXPENDITURE_ALREADY_APPROVED);
        }

        // if the delete request comes from employee, it can be deleted
        if (user.getId().equals(expenditure.getEmployeeId())) {
            expenditure.setStatus(EStatus.DELETED);
            expenditureRepository.save(expenditure);
            return true;
        }
        // if the delete request comes from manager, it is actually a decline request
        expenditure.setStatus(EStatus.DECLINED);
        expenditureRepository.save(expenditure);

//        String key = "personelDocuments/" + attachedFile;
//        s3Service.deleteObject(bucketName, key);

        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.EXPENDITURE_REJECT_NOTIFICATION.getText() + expenditure.getDescription())
                .userType(null)
                .userId(expenditure.getEmployeeId())
                .companyId(null)
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.WARNING)
                .url(EXPENDITURE)
                .build());
        return true;
    }

    public Boolean cancel(Long id) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        Expenditure expenditure = expenditureRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.EXPENDITURE_NOT_FOUND));

        // if the expenditure is approved, it can be canceled
        if (expenditure.getIsExpenditureApproved()) {

            // If the cancel comes from employee
            if (user.getId().equals(expenditure.getEmployeeId())) {
                notificationService.save(NotificationSaveRequestDto.builder()
                        .notificationText(ENotificationTextBase.EXPENDITURE_CANCEL_NOTIFICATION.getText() + expenditure.getDescription())
                        .userType(EUserType.MANAGER)
                        .userId(null)
                        .companyId(user.getCompanyId())
                        .isRead(false)
                        .status(EStatus.ACTIVE)
                        .notificationType(ENotificationType.WARNING)
                        .url(EXPENDITURE)
                        .build());
            }else { // If the cancel comes from manager
                notificationService.save(NotificationSaveRequestDto.builder()
                        .notificationText(ENotificationTextBase.EXPENDITURE_CANCEL_NOTIFICATION.getText() + expenditure.getDescription())
                        .userType(null)
                        .userId(expenditure.getEmployeeId())
                        .companyId(null)
                        .isRead(false)
                        .status(EStatus.ACTIVE)
                        .notificationType(ENotificationType.WARNING)
                        .url(EXPENDITURE)
                        .build());
            }
            expenditure.setStatus(EStatus.CANCELED);
            expenditure.setIsExpenditureApproved(false);
            expenditure.setApproveDate(null);
            // if the expenditure is not approved, it can not be canceled, and it will be deleted or rejected
        } else {
            delete(id);
            return true;
        }

        expenditureRepository.save(expenditure);
        return true;
    }

    public List<Expenditure> findExpendituresByCompanyIdAndCurrentMonth(Long companyId) {
        return expenditureRepository.findExpendituresByCompanyIdAndCurrentMonth(companyId);
    }


    public List<Expenditure> getAllExpendituresOfEmployeeByCurrentMonth()
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        int dayOfMonth = LocalDate.now().getDayOfMonth();
        return expenditureRepository.findAllByEmployeeIdAndStatusAndApproveDateIsBetween(employee.getId(), EStatus.ACTIVE, LocalDate.now().withDayOfMonth(1), LocalDate.now().withDayOfMonth(dayOfMonth));

    }
}
