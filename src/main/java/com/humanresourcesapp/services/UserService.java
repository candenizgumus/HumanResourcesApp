package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.UserRepository;
import com.humanresourcesapp.utility.JwtTokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService
{
    private final UserRepository userRepository;
    private final CompanyService companyService;
    private final JwtTokenManager jwtTokenManager;


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

    public List<User> getAll()
    {

        return userRepository.findAll();
    }

    public List<User> getAllUsersOfManagerByCompanyId(String token)
    {
        Long authId = jwtTokenManager.getAuthIdFromToken(token).orElseThrow(() -> new HumanResourcesAppException(ErrorType.INVALID_TOKEN));
        User user = userRepository.findByAuthId(authId).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return userRepository.findAllByCompanyId(user.getCompanyId());
    }

    public User findById(Long id)
    {
        return userRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.ID_NOT_FOUND));
    }
}
