package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.ExpenditureSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Expenditure;
import com.humanresourcesapp.entities.User;
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

        //TODO BURADAN MAANAGER A NOTIFICATION GONDERMEK LAZIM
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
            return true;

        }
       return false;
    }
}
