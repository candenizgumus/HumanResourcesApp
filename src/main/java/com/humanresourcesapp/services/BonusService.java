package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.BonusSaveRequestDto;
import com.humanresourcesapp.entities.Bonus;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.BonusRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BonusService
{
    private final BonusRepository bonusRepository;
    private final UserService userService;

    public Boolean save(BonusSaveRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        bonusRepository.save(Bonus
                .builder()
                        .bonusDate(dto.bonusDate())
                        .bonusAmount(dto.bonusAmount())
                        .description(dto.description())
                        .companyId(manager.getCompanyId())
                        .status(EStatus.ACTIVE)
                        .employeeId(dto.employeeId())
                .build());;
        return true;
    }
}
