package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.AuthLoginRequestDto;
import com.humanresourcesapp.dto.requests.PasswordChangeRequestDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.model.MailModel;
import com.humanresourcesapp.repositories.AuthRepository;
import com.humanresourcesapp.utility.EmailService;
import com.humanresourcesapp.utility.JwtTokenManager;
import com.humanresourcesapp.utility.PasswordEncoder;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService
{
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

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
        return null;
    }

    public Optional<Auth> findByEmail(String email)
    {
        return authRepository.findByEmail(email);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
    }


    public Boolean changePassword(PasswordChangeRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        Auth auth = authRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        if (passwordEncoder.bCryptPasswordEncoder().matches(dto.password(), auth.getPassword()))
        {

            auth.setPassword(passwordEncoder.bCryptPasswordEncoder().encode(dto.newPassword()));
            authRepository.save(auth);
            return true;
        }else
        {
            throw new HumanResourcesAppException(ErrorType.WRONG_PASSWORD);
        }


    }
}
