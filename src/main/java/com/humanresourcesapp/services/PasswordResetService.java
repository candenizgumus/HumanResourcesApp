package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.ResetPasswordRequestDto;
import com.humanresourcesapp.entities.PasswordReset;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.model.MailModel;
import com.humanresourcesapp.repositories.PasswordResetRepository;
import com.humanresourcesapp.utility.CodeGenerator;
import com.humanresourcesapp.utility.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetRepository passwordResetRepository;
    private final EmailService emailService;
    private final UserService userService;

    public PasswordReset createPasswordResetToken(String email) {
        String token = CodeGenerator.generateCode();
        PasswordReset passwordReset = new PasswordReset();
        passwordReset.setToken(token);
        passwordReset.setEmail(email);
        passwordReset.setExpiryDate(new Date(System.currentTimeMillis() + 3600000)); // 1 hour expiry

        passwordResetRepository.save(passwordReset);

        return passwordReset;

    }

    public boolean sendPasswordResetEmail(String email) {
        if (userService.findByEmail(email).isEmpty()) {
            throw new HumanResourcesAppException(ErrorType.USER_NOT_FOUND);
        }
        PasswordReset passwordReset = createPasswordResetToken(email);
        String resetLink = "http://localhost:3000/password-reset?token=" + passwordReset.getToken();
        MailModel mailModel = MailModel.builder()
                .to(passwordReset.getEmail())
                .subject("Password reset")
                .message("Your password reset code is: " + passwordReset.getToken() + " , available for 1 hour! \n" +
                        "You can also reset your password using this link: " + resetLink)
                .build();
            return emailService.send(mailModel);
    }

    public boolean resetPassword(ResetPasswordRequestDto resetPasswordRequestDto) {
        Optional<PasswordReset> passwordResetOptional = passwordResetRepository.findByToken(resetPasswordRequestDto.token());
        if (passwordResetOptional.isEmpty()) {
            throw new HumanResourcesAppException(ErrorType.INVALID_TOKEN);
        }

        PasswordReset passwordReset = passwordResetOptional.get();
        if (passwordReset.getExpiryDate().before(new Date(System.currentTimeMillis()))) {
            throw new HumanResourcesAppException(ErrorType.TOKEN_EXPIRED);
        }

        userService.updatePassword(passwordReset.getEmail(), resetPasswordRequestDto.newPassword());
        passwordResetRepository.delete(passwordReset);
        return true;
    }

}
