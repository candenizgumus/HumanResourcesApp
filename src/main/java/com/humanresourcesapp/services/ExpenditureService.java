package com.humanresourcesapp.services;

import com.humanresourcesapp.constants.ENotificationTextBase;
import com.humanresourcesapp.dto.requests.ExpenditureSaveRequestDto;
import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Expenditure;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.ExpenditureRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static com.humanresourcesapp.constants.FrontendPaths.EXPENDITURE;

@Service
@RequiredArgsConstructor
public class ExpenditureService
{
    private final ExpenditureRepository expenditureRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public Expenditure save(ExpenditureSaveRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        Expenditure expenditure = Expenditure
                .builder()
                .employeeId(employee.getId())
                .description(dto.description())
                .price(dto.price())
                .companyId(employee.getCompanyId())
                .employeeName(employee.getName())
                .employeeSurname(employee.getSurname())
                .status(EStatus.ACTIVE)
                .build();

        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.EXPENDITURE_REQUEST_NOTIFICATION.getText() + userEmail)
                .userType(null)
                .userId(employee.getManagerId())
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.WARNING)
                .url(EXPENDITURE)
                .build());

        return expenditureRepository.save(expenditure);
    }

    public List<Expenditure> searchByEmployeeId(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        return expenditureRepository.searchByEmployeeId(dto.searchText(), employee.getId(), PageRequest.of(dto.page(), dto.pageSize()));
    }


    public List<Expenditure> searchByCompanyId(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        return expenditureRepository.searchByCompanyId(dto.searchText(), manager.getCompanyId(), PageRequest.of(dto.page(), dto.pageSize()));

    }

    public Boolean approveExpenditure(Long id)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        Expenditure expenditure = expenditureRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.EXPENDITURE_NOT_FOUND));
        if (!expenditure.getCompanyId().equals(manager.getCompanyId()))
        {
            throw new HumanResourcesAppException(ErrorType.INVALID_ACCOUNT);
        }

        if (!expenditure.getIsExpenditureApproved())
        {
            expenditure.setIsExpenditureApproved(true);
            expenditure.setApproveDate(LocalDate.now());
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

    //TODO implement decline
    /*
    notificationService.save(NotificationSaveRequestDto.builder()
                    .notificationText(ENotificationTextBase.EXPENDITURE_REJECT_NOTIFICATION.getText() + expenditure.getDescription())
                    .userType(null)
                    .userId(expenditure.getEmployeeId())
                    .isRead(false)
                    .status(EStatus.ACTIVE)
                    .notificationType(ENotificationType.ERROR)
                    .url(EXPENDITURE)
                    .build());

     */

    //TODO implement cancel
    /*
    notificationService.save(NotificationSaveRequestDto.builder()
                    .notificationText(ENotificationTextBase.EXPENDITURE_CANCEL_NOTIFICATION.getText() + userEmail)
                    .userType(null)
                    .userId(expenditure.getEmployeeId())
                    .isRead(false)
                    .status(EStatus.ACTIVE)
                    .notificationType(ENotificationType.WARNING)
                    .url(EXPENDITURE)
                    .build());
     */
}
