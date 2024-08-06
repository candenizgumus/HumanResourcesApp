package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.SendOfferToCustomerRequestDto;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.model.MailModel;
import com.humanresourcesapp.services.UserService;
import com.humanresourcesapp.utility.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT+EMAIL)
@RequiredArgsConstructor
@CrossOrigin("*")
public class EmailController
{
    private final EmailService emailService;
    private final UserService userService;

    @PostMapping(SAVE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Boolean> sendOfferToCustomer(SendOfferToCustomerRequestDto dto){

        User user = userService.findById(dto.userId());

        emailService.send(MailModel.builder().to(user.getEmail()).subject("EASY HR - New Offer Plan").message(dto.emailText()).build());
        return ResponseEntity.ok(true);

    }
}
