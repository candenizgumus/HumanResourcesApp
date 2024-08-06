package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.ResetPasswordRequestDto;
import com.humanresourcesapp.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT+PASSWORD_RESET)
@RequiredArgsConstructor
@CrossOrigin("*")
public class PasswordResetController {
    private final PasswordResetService passwordResetService;

    @PostMapping(SEND_PASSWORD_RESET_EMAIL)
    public void sendPasswordResetEmail(String email) {
        passwordResetService.sendPasswordResetEmail(email);
    }

    @PostMapping(RESET_PASSWORD)
    public void resetPassword(@RequestBody ResetPasswordRequestDto resetPasswordRequestDto) {
        passwordResetService.resetPassword(resetPasswordRequestDto);
    }

}
