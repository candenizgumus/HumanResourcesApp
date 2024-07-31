package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.AuthLoginRequestDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.AuthRepository;
import com.humanresourcesapp.utility.JwtTokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService
{
    private final AuthRepository authRepository;
    private final JwtTokenManager jwtTokenManager;


    public Optional<Auth> findById(Long id)
    {
        return authRepository.findById(id);
    }

    public Auth save(Auth auth)
    {
        return authRepository.save(auth);
    }


    public String login(AuthLoginRequestDto dto)
    {
        Auth auth = authRepository.findByEmailAndPassword(dto.email(), dto.password()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.EMAIL_OR_PASSWORD_WRONG));
        return jwtTokenManager.createTokenFromAuth(auth).orElseThrow(() -> new HumanResourcesAppException(ErrorType.TOKEN_CREATION_FAILED));
    }

    public Optional<Auth> findByEmail(String email)
    {
        return authRepository.findByEmail(email);
    }
}
