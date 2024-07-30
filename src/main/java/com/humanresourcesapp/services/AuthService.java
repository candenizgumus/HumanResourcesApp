package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.AuthRegisterRequestDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
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

    public Boolean register(AuthRegisterRequestDto dto)
    {

       //TODO BURASI ADMIN TARAFINDAN ONAYLANACAK VE REGISTER OLACAK

        return true;
    }

    public String login(Auth auth)
    {
        return null;
    }

    public Optional<Auth> findByEmail(String email)
    {
        return authRepository.findByEmail(email);
    }
}
