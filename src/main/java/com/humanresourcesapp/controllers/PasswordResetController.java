package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.ResetPasswordRequestDto;
import com.humanresourcesapp.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT+PASSWORD_RESET)
@RequiredArgsConstructor
public class PasswordResetController {
    private final PasswordResetService passwordResetService;

    @PostMapping(SEND_PASSWORD_RESET_EMAIL)
    public ResponseEntity<Boolean> sendPasswordResetEmail(String email) {
        return ResponseEntity.ok(passwordResetService.sendPasswordResetEmail(email));
    }

    @PostMapping(RESET_PASSWORD)
    public ResponseEntity<Boolean> resetPassword(@RequestBody ResetPasswordRequestDto resetPasswordRequestDto) {
        return ResponseEntity.ok(passwordResetService.resetPassword(resetPasswordRequestDto));
    }

}
