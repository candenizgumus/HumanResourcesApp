package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.repositories.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService
{
    private final AuthRepository authRepository;

    public Optional<Auth> findById(Long id)
    {
        return authRepository.findById(id);
    }
}
