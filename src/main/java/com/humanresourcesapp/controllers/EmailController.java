package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.SendOfferToCustomerRequestDto;
import com.humanresourcesapp.entities.Offer;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.model.MailModel;
import com.humanresourcesapp.services.OfferService;
import com.humanresourcesapp.services.UserService;
import com.humanresourcesapp.utility.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT+EMAIL)
@RequiredArgsConstructor
@CrossOrigin("*")
public class EmailController
{
    private final EmailService emailService;
    private final OfferService offerService;

    @PostMapping(SAVE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Boolean> sendOfferToCustomer(@RequestBody SendOfferToCustomerRequestDto dto){

        Offer offer = offerService.findByEmail(dto.offerEmail()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.OFFER_NOT_FOUND));

        emailService.send(MailModel.builder().to(offer.getEmail()).subject("EASY HR - New Offer Plan").message(dto.emailText()).build());
        return ResponseEntity.ok(true);

    }
}
