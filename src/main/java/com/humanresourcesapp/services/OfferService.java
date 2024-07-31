package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.OfferSaveRequestDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.Offer;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.OfferRepository;
import com.humanresourcesapp.utility.JwtTokenManager;
import com.humanresourcesapp.utility.PasswordGenerator;
import com.humanresourcesapp.views.VwGetAllOffer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OfferService
{
    private final OfferRepository offerRepository;
    private final UserService userService;
    private final JwtTokenManager jwtTokenManager;
    private final AuthService authService;
    private final CompanyService companyService;


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

    public List<VwGetAllOffer> getAllOffer(String token)
    {
        jwtTokenManager.getAuthIdFromToken(token).orElseThrow(() -> new HumanResourcesAppException(ErrorType.INVALID_TOKEN));
        jwtTokenManager.getUserTypeFromToken(token).orElseThrow(() -> new HumanResourcesAppException(ErrorType.NOT_AUTHORIZED));
        return offerRepository.getAllOffer(token);
    }

    public Boolean approveOfferAndRegisterAuthAndUser(Long offerId)
    {
        Offer offer = offerRepository.findById(offerId).orElseThrow(() -> new HumanResourcesAppException(ErrorType.OFFER_NOT_FOUND));
        //Setting status to active
        offer.setStatus(EStatus.ACTIVE);
        offerRepository.save(offer);

        //Generating new password for customer
        //TODO we need to hash the password in the database
        String newPassword = PasswordGenerator.generatePassword();
        //TODO Sending new password to customer. Need EmailService




        //Creating new auth,user and company entities
        //TODO we need to determine what we are going to do with activationCode
        Auth auth = authService.save(Auth
                .builder()
                .email(offer.getEmail())
                .password(newPassword)
                .userType(offer.getUserType())
                .build()
        );


        Company company = companyService.save(Company
                .builder()
                .name(offer.getCompanyName())
                .build());

        userService.save(User
                .builder()
                .authId(auth.getId())
                .email(offer.getEmail())
                .phone(offer.getPhone())
                .name(offer.getName())
                .surname(offer.getSurname())
                .companyId(company.getId())
                .userType(offer.getUserType())
                .build());

        return true;
    }
}
