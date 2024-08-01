package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.CompanySaveRequestDto;
import com.humanresourcesapp.dto.requests.OfferSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.Offer;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.model.MailModel;
import com.humanresourcesapp.repositories.OfferRepository;
import com.humanresourcesapp.utility.EmailService;
import com.humanresourcesapp.utility.JwtTokenManager;
import com.humanresourcesapp.utility.PasswordEncoder;
import com.humanresourcesapp.utility.PasswordGenerator;
import com.humanresourcesapp.views.VwGetAllOffer;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfferService
{
    private final OfferRepository offerRepository;
    private final UserService userService;
    private final AuthService authService;
    private final CompanyService companyService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;


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

        //EUsertype set to the manager for now. Maybe we can change it later...
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
                        .userType(EUserType.MANAGER)
                        .build());


        return true;
    }

    public List<VwGetAllOffer> getAllOffer(PageRequestDto dto)
    {

        return offerRepository.getAllOffer(PageRequest.of(dto.page(), dto.pageSize()));
    }

    public Boolean approveOfferAndRegisterAuthAndUser(Long offerId)
    {
        Offer offer = offerRepository.findById(offerId).orElseThrow(() -> new HumanResourcesAppException(ErrorType.OFFER_NOT_FOUND));
        //Setting status to active
        offer.setStatus(EStatus.ACTIVE);
        offerRepository.save(offer);

        //Generating new password for customer
        String newPassword = PasswordGenerator.generatePassword();
        String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(newPassword);

        //Send email with new password
        emailService.send(MailModel.builder().to(offer.getEmail()).subject("Your new password").message("Your new password is: " + newPassword).build());

        //Creating new auth,user and company entities
        //TODO we need to determine what we are going to do with activationCode
        Auth auth = authService.save(Auth
                .builder()
                .email(offer.getEmail())
                .password(encodedPassword)
                .userType(offer.getUserType())
                .status(EStatus.ACTIVE)
                .build()
        );


        Company company = companyService.save(new CompanySaveRequestDto(offer.getCompanyName(),null));

        userService.save(User
                .builder()
                .authId(auth.getId())
                .email(offer.getEmail())
                .phone(offer.getPhone())
                .name(offer.getName())
                .surname(offer.getSurname())
                .companyId(company.getId())
                .userType(offer.getUserType())
                .status(EStatus.ACTIVE)
                .build());

        return true;
    }
}
