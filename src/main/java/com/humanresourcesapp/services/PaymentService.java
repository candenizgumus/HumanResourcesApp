package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.PaymentSaveRequestDto;
import com.humanresourcesapp.entities.Payment;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.PaymentRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService
{
    private final PaymentRepository paymentRepository;
    private final UserService userService;

    public Boolean save(PaymentSaveRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        paymentRepository.save(Payment
                .builder()
                        .companyId(manager.getCompanyId())
                        .description(dto.description())
                        .payment(dto.payment())
                        .paymentDate(dto.paymentDate())
                        .status(EStatus.ACTIVE)
                .build());
        return true;
    }

    public List<Payment> getAll(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return paymentRepository.findByDescriptionContainingAndCompanyIdAndStatus(dto.searchText(), manager.getCompanyId(), EStatus.ACTIVE, PageRequest.of(dto.page(), dto.pageSize()));

    }
}
