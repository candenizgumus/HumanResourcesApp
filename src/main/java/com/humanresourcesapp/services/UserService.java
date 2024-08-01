package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.AddEmployeeToManagerRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.model.MailModel;
import com.humanresourcesapp.repositories.UserRepository;
import com.humanresourcesapp.utility.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService
{
    private final UserRepository userRepository;
    private final CompanyService companyService;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;


    public User save(User user)
    {
        if (user.getCompanyId() != null)
        {
            companyService.findById(user.getCompanyId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.COMPANY_NOT_FOUND));
        }

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

    public List<User> getAll(PageRequestDto dto)
    {

        return userRepository.findAll(PageRequest.of(dto.page(), dto.pageSize())).getContent();
    }

    public List<User> getAllUsersOfManagerByCompanyId()
    {

        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return userRepository.findAllByCompanyId(user.getCompanyId());
    }

    public User findById(Long id)
    {
        return userRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.ID_NOT_FOUND));
    }

    public User addEmployeeToManager(AddEmployeeToManagerRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        //Checking email and phone
        if (userRepository.findByEmailAndPhone(dto.email(), dto.phone()).isPresent())
        {
            throw new HumanResourcesAppException(ErrorType.EMAIL_OR_PHONE_TAKEN);
        }

        //Generating new password for customer
        String newPassword = PasswordGenerator.generatePassword();
        String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(newPassword);

        //Send email with new password
        emailService.send(MailModel.builder().to(dto.email()).subject("Your new password").message("Your new password is: " + newPassword).build());

        //Creating new auth and user entities for new employee.

        Auth auth = authService.save(Auth
                .builder()
                .email(dto.email())
                .password(encodedPassword)
                .userType(EUserType.EMPLOYEE)
                .status(EStatus.ACTIVE)
                .build()
        );

        User employee = userRepository.save(User
                .builder()
                .authId(auth.getId())
                .email(dto.email())
                .phone(dto.phone())
                .name(dto.name())
                .surname(dto.surname())
                .companyId(manager.getCompanyId())
                .userType(EUserType.EMPLOYEE)
                .hireDate(dto.hireDate())
                .birthDate(dto.birtDate())
                .managerId(manager.getId())
                .status(EStatus.ACTIVE)
                .position(dto.ePosition())
                .build());

        return userRepository.save(employee);
    }
}
