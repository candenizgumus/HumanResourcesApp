package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.*;
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
import com.humanresourcesapp.utility.PasswordEncoder;
import com.humanresourcesapp.utility.PasswordGenerator;
import com.humanresourcesapp.views.VwGetAllOffer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        //User check
        if (userService.findByEmail(dto.email()).isPresent())
        {
            throw  new HumanResourcesAppException(ErrorType.EMAIL_TAKEN);
        }
        if (userService.findByPhone(dto.phone()).isPresent())
        {
            throw  new HumanResourcesAppException(ErrorType.PHONE_TAKEN);
        }
        //offer check
        if (offerRepository.findByEmail(dto.email()).isPresent()){
            throw  new HumanResourcesAppException(ErrorType.EMAIL_TAKEN);
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
                        .sector(dto.sector())
                        .build());


        return true;
    }

    public List<VwGetAllOffer> getAllOffer(PageRequestDto dto)
    {
        return offerRepository.getAllOfferByEmailSearch(dto.searchText(),PageRequest.of(dto.page(), dto.pageSize()));
    }

    public Boolean approveOfferAndRegisterAuthAndUser(OfferApproveRequestDto dto)
    {
        Offer offer = offerRepository.findById(dto.offerId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.OFFER_NOT_FOUND));
        //Setting status to active
        offer.setStatus(EStatus.ACTIVE);
        offerRepository.save(offer);

        //Generating new password for customer
        String newPassword = PasswordGenerator.generatePassword();
        String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(newPassword);

        //Send searchText with new password
        emailService.send(MailModel.builder().to(offer.getEmail()).subject("Your new password").message("Your new password is: " + newPassword).build());

        //Creating new auth,user and company entities
        //TODO we need to determine what we are going to do with activationCode
        Auth auth = authService.save(Auth
                .builder()
                .email(offer.getEmail())
                .password(encodedPassword)
                .userType(offer.getUserType())
                .status(EStatus.ACTIVE)
                .subscriptionType(dto.ESubscriptionType())
                .build()
        );


        Company company = companyService.save(CompanySaveRequestDto.builder().numberOfEmployee(1).name(offer.getCompanyName()).logo("").build());


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
                .sector(offer.getSector())
                .subscriptionType(dto.ESubscriptionType())
                        .subscriptionStartDate(auth.getSubscriptionStartDate())
                        .subscriptionEndDate(auth.getSubscriptionEndDate())
                .build());

        return true;
    }

    public Optional<Offer> findByEmail(String email)
    {
        return offerRepository.findByEmail(email);
    }

    public Boolean delete(Long offerId)
    {
        Offer offer = offerRepository.findById(offerId).orElseThrow(() -> new HumanResourcesAppException(ErrorType.OFFER_NOT_FOUND));
        offer.setStatus(EStatus.DECLINED);
        offerRepository.save(offer);
        return true;
    }

    public Long getCount(PageCountRequestDto dto) {
        return offerRepository.getAllOfferByEmailSearchCount(dto.searchText());
    }
}
