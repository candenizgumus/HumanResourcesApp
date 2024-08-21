package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.AuthLoginRequestDto;
import com.humanresourcesapp.dto.requests.DeactivateAccountRequestDto;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService
{
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private CompanyService companyService;
    private UserService userService;

    @Autowired
    public void setUserService(@Lazy UserService userService , @Lazy CompanyService companyService)
    {
        this.userService = userService;
        this.companyService = companyService;
    }

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

    public void inactivateAllRelatedAccounts(Long id)
    {
        Auth auth = authRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        User user = userService.findByAuthId(auth.getId());

        userService.findAllByCompanyId(user.getCompanyId()).forEach(user1 -> {
            user1.setStatus(EStatus.INACTIVE);
            userService.save(user1);

            Optional<Auth> auth1 = authRepository.findById(user1.getAuthId());
            auth1.get().setStatus(EStatus.INACTIVE);
            authRepository.save(auth1.get());
        });

        companyService.findById(user.getCompanyId()).ifPresent(company -> {
            company.setStatus(EStatus.INACTIVE);
            companyService.update(company);
        });

    }

    public Boolean deactivateAccount(DeactivateAccountRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        Auth auth = authRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        if (!passwordEncoder.bCryptPasswordEncoder().matches(dto.password(), auth.getPassword()))
        {
            throw new HumanResourcesAppException(ErrorType.WRONG_PASSWORD);
        }
        User user = userService.findByAuthId(auth.getId());
        //Superadmin check
        if (auth.getEmail().equals("admin") )
        {
            throw new HumanResourcesAppException(ErrorType.SUPERADMIN_CANNOT_BE_DEACTIVATED);
        }
        List<User> managerList = userService.findAllByUserTypeAndStatusAndCompanyId(EUserType.MANAGER,EStatus.ACTIVE,user.getCompanyId());

        //if usertype is manager all of is realted accounts will be deactivated
        if (managerList.size() == 1 && user.getUserType().equals(EUserType.MANAGER))
        {
            inactivateAllRelatedAccounts(user.getAuthId());
        }
        if(user.getUserType().equals(EUserType.MANAGER) && dto.deactivateAll() ){
            inactivateAllRelatedAccounts(user.getAuthId());
        }
        auth.setStatus(EStatus.INACTIVE);
        authRepository.save(auth);

        user.setStatus(EStatus.INACTIVE);
        userService.save(user);
        return true;
    }
}
