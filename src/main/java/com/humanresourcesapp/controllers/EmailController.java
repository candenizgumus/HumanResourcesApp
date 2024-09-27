package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.SendOfferToCustomerRequestDto;
import com.humanresourcesapp.entities.Offer;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.model.MailModel;
import com.humanresourcesapp.services.OfferService;
import com.humanresourcesapp.utility.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT+EMAIL)
@RequiredArgsConstructor
public class EmailController
{
    private final EmailService emailService;
    private final OfferService offerService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Boolean> sendOfferToCustomer(@RequestBody SendOfferToCustomerRequestDto dto){

        Offer offer = offerService.findByEmail(dto.offerEmail()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.OFFER_NOT_FOUND));
        offer.setStatus(EStatus.IN_PROGRESS);
        offerService.save(offer);
        emailService.send(MailModel.builder().to(offer.getEmail()).subject("EASY HR - New Offer Plan").message(dto.emailText()).build());
        return ResponseEntity.ok(true);

    }

    @PostMapping("/send-email")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Boolean> sendEmail(@RequestBody MailModel mailModel)
    {
        emailService.send(MailModel.builder().to(mailModel.getTo()).subject(mailModel.getSubject()).message(mailModel.getMessage()).build());
        return ResponseEntity.ok(true);
    }
}
