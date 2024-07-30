package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService
{
    private final UserRepository userRepository;
    private final CompanyService companyService;


    public User save(User user)
    {
        companyService.findById(user.getCompanyId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.COMPANY_NOT_FOUND));

        userRepository.save(user);
        return user;
    }

    public Optional<User> findByPhone(String phone)
    {
        return userRepository.findByPhone(phone);
    }
    public Optional<User> findByEmail(String email)
    {
        return userRepository.findByEmail(email);
    }
}
