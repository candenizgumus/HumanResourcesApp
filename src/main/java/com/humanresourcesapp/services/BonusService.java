package com.humanresourcesapp.services;

import com.humanresourcesapp.constants.ENotificationTextBase;
import com.humanresourcesapp.dto.requests.BonusSaveRequestDto;
import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Bonus;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.BonusRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static com.humanresourcesapp.constants.FrontendPaths.BONUS;
import static com.humanresourcesapp.constants.FrontendPaths.HOME;

@Service
@RequiredArgsConstructor
public class BonusService
{
    private final BonusRepository bonusRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public Boolean save(BonusSaveRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));


        User employee = userService.findById(dto.employeeId());

        bonusRepository.save(Bonus
                .builder()
                        .bonusDate(dto.bonusDate())
                        .bonusAmount(dto.bonusAmount())
                        .description(dto.description())
                        .companyId(manager.getCompanyId())
                        .status(EStatus.ACTIVE)
                        .name(employee.getName())
                        .surname(employee.getSurname())
                        .email(employee.getEmail())
                        .employeeId(dto.employeeId())
                .build());;

        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.BONUS_NOTIFICATION.getText() + manager.getName() + " " + manager.getSurname())
                .userType(null)
                .userId(employee.getId())
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.INFORMATION)
                .url(BONUS)
                .build());
        return true;
    }

    public List<Bonus> getAll(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return bonusRepository.findByEmailContainingAndCompanyIdAndStatus(dto.searchText(), manager.getCompanyId(), EStatus.ACTIVE, PageRequest.of(dto.page(), dto.pageSize()));
    }

    public Boolean delete(Long id)
    {
        Bonus bonus = bonusRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.BONUS_NOT_FOUND));
        if (bonus.getStatus() != EStatus.DELETED)
        {
            bonus.setStatus(EStatus.DELETED);
            bonusRepository.save(bonus);
            return true;
        }
        else
        {
            return false;
        }

    }

    public List<Bonus> findMonthlyBonusesOfEmployees()
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        LocalDate now = LocalDate.now();
        int month = now.getMonth().getValue();
        int lastDay = now.lengthOfMonth();

        LocalDate firstDateOfMonth = LocalDate.of(now.getYear(), month, 1);
        LocalDate lastDateOfMonth = LocalDate.of(now.getYear(), month, lastDay);

        return bonusRepository.findAllByBonusDateIsBetweenAndCompanyIdAndStatus(firstDateOfMonth, lastDateOfMonth, manager.getCompanyId(), EStatus.ACTIVE);
    }

    public List<Bonus> getAllBonusesOfEmployee(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return bonusRepository.findAllByDescriptionContainingAndEmployeeIdAndStatus(dto.searchText(), employee.getId(), EStatus.ACTIVE, PageRequest.of(dto.page(), dto.pageSize()));
    }
}
