package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.ExpenditureSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Expenditure;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.ExpenditureRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

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


}
