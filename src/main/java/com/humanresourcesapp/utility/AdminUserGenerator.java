package com.humanresourcesapp.utility;

import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.services.AuthService;
import com.humanresourcesapp.services.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor
@Service
public class AdminUserGenerator
{
    private final AuthService authService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;



    @PostConstruct
    public void createAdminUser()
    {
        String adminEmail = "admin";
        String password = "123";

        if (authService.findByEmail(adminEmail).isEmpty())
        {
            String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(password);

            Auth auth = authService.save(Auth.
                    builder()
                    .status(EStatus.ACTIVE)
                    .email(adminEmail)
                    .password(encodedPassword)
                    .userType(EUserType.ADMIN)
                    .build());

            User user = User
                    .builder()
                    .status(EStatus.ACTIVE)
                    .email(adminEmail)
                    .authId(auth.getId()) // Set the retrieved ID from saved Auth
                    .userType(EUserType.ADMIN)
                    .build();
            userService.save(user);
        }

    }
}
