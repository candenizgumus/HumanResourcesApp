package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.repositories.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService
{
    private final AuthRepository authRepository;
    private final UserService userService;

    public Optional<Auth> findById(Long id)
    {
        return authRepository.findById(id);
    }

    public Boolean login(Auth auth)
    {
        Auth authUser = authRepository.save(auth);
        userService.save(User
                .builder()
                .authId(authUser.getId())
                .email(authUser.getEmail())
                .userType(authUser.getUserType())
                .build());

        return false;
    }
}
