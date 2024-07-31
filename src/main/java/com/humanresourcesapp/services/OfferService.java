package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.OfferSaveRequestDto;
import com.humanresourcesapp.entities.Offer;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.OfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OfferService
{
    private final OfferRepository offerRepository;
    private final UserService userService;


    public Boolean save(OfferSaveRequestDto dto)
    {

        if (userService.findByEmail(dto.email()).isPresent())
        {
            throw  new HumanResourcesAppException(ErrorType.EMAIL_TAKEN);
        }
        if (userService.findByPhone(dto.phone()).isPresent())
        {
            throw  new HumanResourcesAppException(ErrorType.PHONE_TAKEN);
        }

        offerRepository.save(
                Offer
                        .builder()
                        .email(dto.email())
                        .phone(dto.phone())
                        .name(dto.name())
                        .surname(dto.surname())
                        .companyName(dto.companyName())
                        .title(dto.title())
                        .numberOfEmployee(dto.numberOfEmployees())
                        .userType(dto.userType())
                        .build());


        return true;
    }
}
