package com.humanresourcesapp.services;

import com.humanresourcesapp.constants.ENotificationTextBase;
import com.humanresourcesapp.dto.requests.*;
import com.humanresourcesapp.dto.responses.CompanyAndManagerNameResponseDto;
import com.humanresourcesapp.dto.responses.CountUserByTypeAndStatusDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.Offer;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.model.MailModel;
import com.humanresourcesapp.repositories.UserRepository;
import com.humanresourcesapp.utility.*;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.humanresourcesapp.constants.FrontendPaths.*;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final CompanyService companyService;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtTokenManager jwtTokenManager;
    private OfferService offerService;

    @Autowired
    public void setOfferService(@Lazy OfferService offerService) {
        this.offerService = offerService;
    }
    private final NotificationService notificationService;


    public User save(User user) {
        if (user.getCompanyId() != null) {
            companyService.findById(user.getCompanyId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.COMPANY_NOT_FOUND));
        }
        userRepository.save(user);
        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.WELCOME_NOTIFICATION.getText())
                .userType(null)
                .userId(user.getId())
                .isRead(false)
                .status(EStatus.ACTIVE)
                .notificationType(ENotificationType.SUCCESS)
                .url(HOME)
                .build());
        return user;
    }

    public Optional<User> findByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAll(PageRequestDto dto) {

        return userRepository.getAllUserByEmailSearch(dto.searchText(),PageRequest.of(dto.page(), dto.pageSize()));
    }

    public List<User> getAllUsersOfManagerByCompanyId(PageRequestDto dto) {

        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userRepository.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return userRepository.findAllUsersByEmailAndManagerId(dto.searchText(), manager.getId(), PageRequest.of(dto.page(), dto.pageSize()));
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.ID_NOT_FOUND));
    }

    public User addEmployeeToManager(AddEmployeeToManagerRequestDto dto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        //Checking email and phone
        if (userRepository.findByEmailAndPhone(dto.email(), dto.phone()).isPresent()) {
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
                        .subscriptionType(manager.getSubscriptionType())
                        .subscriptionStartDate(manager.getSubscriptionStartDate())
                        .subscriptionEndDate(manager.getSubscriptionEndDate())
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
                .birthDate(dto.birthDate())
                .managerId(manager.getId())
                .status(EStatus.ACTIVE)
                .position(dto.ePosition())

                .position(dto.ePosition())
                        .location(dto.location())
                        .title(dto.title())
                        .sector(manager.getSector())
                        .employeeType(dto.eEmployeeType())
                .subscriptionType(manager.getSubscriptionType())
                .subscriptionStartDate(manager.getSubscriptionStartDate())
                .subscriptionEndDate(manager.getSubscriptionEndDate())
                .build());

        //Increasing number of employee in company
        companyService.findById(manager.getCompanyId()).ifPresent(c-> {
            c.setNumberOfEmployee(c.getNumberOfEmployee() + 1);
            companyService.update(c);
        });
        User save = userRepository.save(employee);
        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.WELCOME_NOTIFICATION.getText())
                .userType(null)
                .userId(save.getId())
                .isRead(false)
                .notificationType(ENotificationType.SUCCESS)
                .url(HOME)
                .status(EStatus.ACTIVE)
                .build());
        return save;
    }

    public User findByToken(String token) {
        Long authId = jwtTokenManager.getAuthIdFromToken(token).orElseThrow(() -> new HumanResourcesAppException(ErrorType.INVALID_TOKEN));
        return userRepository.findByAuthId(authId).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
    }

    public CompanyAndManagerNameResponseDto findCompanyNameAndManagerNameOfUser() {

        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        String companyName = null;
        String managerName = null;
        if ( user.getCompanyId() != null) {
            Company company = companyService.findById(user.getCompanyId()).get();
            companyName = company.getName();


        }
        if (user.getManagerId() != null )
        {
            User manager = userRepository.findByAuthId(user.getManagerId()).get();
            managerName = manager.getName() + " " + manager.getSurname();
        }

        return new CompanyAndManagerNameResponseDto(companyName, managerName );
    }


    public void updatePassword(String email, String newPassword) {
        userRepository.findByEmail(email).ifPresent(user -> {
            Auth auth = authService.findById(user.getAuthId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.AUTH_NOT_FOUND));
            auth.setPassword(passwordEncoder.bCryptPasswordEncoder().encode(newPassword));
            authService.save(auth);
        });
    }

    public User update(UpdateUserRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        if (dto.name() != null)
        {
            user.setName(dto.name());
        }
        if (dto.surname() != null)
        {
            user.setSurname(dto.surname());
        }
        if (dto.phone() != null)
        {
            user.setPhone(dto.phone());
        }
        if (dto.title() != null)
        {
            user.setTitle(dto.title());
        }
        if (dto.birthDate() != null)
        {
            user.setBirthDate(dto.birthDate());
        }
        if (dto.position() != null)
        {
            user.setPosition(dto.position());
        }
        if (dto.location() != null)
        {
            user.setLocation(dto.location());
        }


        return userRepository.save(user);

    }

    public Boolean updateUserByAdmin(UpdateUserByAdminRequestDto dto)
    {
        User user = userRepository.findById(dto.userId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

            if (dto.name() != null)
            {
                user.setName(dto.name());
            }
            if (dto.surname() != null)
            {
                user.setSurname(dto.surname());
            }
            if (dto.phone() != null)
            {
                user.setPhone(dto.phone());
            }
            if (dto.status() != null)
            {
                user.setStatus(dto.status());

                authService.findByEmail(user.getEmail()).ifPresent(auth -> {
                    auth.setStatus(dto.status());
                    authService.save(auth);
                });
            }


            userRepository.save(user);

            //if usertype is manager we need to set status of employees either
            if (user.getUserType() == EUserType.MANAGER)
            {
                //Updating users
                List<User> userList = userRepository.findAllByManagerId(user.getId());
                userList.forEach(employee -> {
                        if (employee.getStatus() != EStatus.DELETED)
                        {
                            employee.setStatus(dto.status());
                        }
                    }
                        );
                userRepository.saveAll(userList);

                //Updating auths
                userList.forEach(auth -> {
                    authService.findByEmail(auth.getEmail()).ifPresent(auth1 -> {
                        if (auth1.getStatus() != EStatus.DELETED)
                        {
                            auth1.setStatus(dto.status());
                            authService.save(auth1);
                        }
                    });
                });

                //Updating company
                companyService.findById(user.getCompanyId()).ifPresent(company -> {
                    if (company.getStatus() != EStatus.DELETED)
                    {
                    company.setStatus(dto.status());
                    companyService.update(company);
                    }
                });
            }

        return true;
    }
    public Long getCount(PageCountRequestDto dto) {
        return userRepository.getAllUserByEmailSearchCount(dto.searchText());
    }

    public List<Long> getCountByMonth()
    {
        List<Long> countList = new ArrayList<>();
        Long january = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 1, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 1, 30, 0, 0));
        Long February = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 2, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 2, 28, 0, 0));
        Long march = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 3, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 3, 30, 0, 0));
        Long april = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 4, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 4, 30, 0, 0));
        Long may = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 5, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 5, 30, 0, 0));
        Long june = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 6, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 6, 30, 0, 0));
        Long july = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 7, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 7, 30, 0, 0));
        Long august = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 8, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 8, 30, 0, 0));
        Long september = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 9, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 9, 30, 0, 0));
        Long october = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 10, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 10, 30, 0, 0));
        Long november = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 11, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 11, 30, 0, 0));
        Long december = userRepository.countByCreatedAtBetween(LocalDateTime.of(Year.now().getValue(), 12, 1, 0, 0), LocalDateTime.of(Year.now().getValue(), 12, 30, 0, 0));

        countList.add(january);
        countList.add(February);
        countList.add(march);
        countList.add(april);
        countList.add(may);
        countList.add(june);
        countList.add(july);
        countList.add(august);
        countList.add(september);
        countList.add(october);
        countList.add(november);
        countList.add(december);
        return countList;
    }


    public Boolean delete(Long id)
    {
        //Changing status of user and auth
        User user = userRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        user.setStatus(EStatus.DELETED);
        userRepository.save(user);
        Auth auth = authService.findByEmail(user.getEmail()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.AUTH_NOT_FOUND));
        auth.setStatus(EStatus.DELETED);
        authService.save(auth);

        //Setting companyEmployee count
        companyService.findById(user.getCompanyId()).ifPresent(company -> {
            company.setNumberOfEmployee(company.getNumberOfEmployee() - 1);
            companyService.update(company);
        });

        return true;
    }

    public User updateEmployee(UpdateEmployeeByManagerDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        User user = userRepository.findById(dto.employeeId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        //Checking if manager is valid
        if (manager.getId() != user.getManagerId())
        {
            throw new HumanResourcesAppException(ErrorType.INVALID_ACCOUNT);
        }

        if (dto.name() != null)
        {
            user.setName(dto.name());
        }
        if (dto.surname() != null)
        {
            user.setSurname(dto.surname());
        }
        if (dto.phone() != null)
        {
            user.setPhone(dto.phone());
        }
        if (dto.title() != null)
        {
            user.setTitle(dto.title());
        }
        if (dto.birthDate() != null)
        {
            user.setBirthDate(dto.birthDate());
        }

        if (dto.hireDate() != null)
        {
            user.setHireDate(dto.hireDate());
        }
        if (dto.location() != null)
        {
            user.setLocation(dto.location());
        }
        if (dto.eEmployeeType() != null)
        {
            user.setEmployeeType(dto.eEmployeeType());
        }
        if (dto.position() != null)
        {
            user.setPosition(dto.position());
        }




        userRepository.save(user);

        return user;
    }

    public Boolean activateEmployee(Long id)
    {
        User user = userRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        if (user.getStatus() == EStatus.DELETED)
        {
            user.setStatus(EStatus.ACTIVE);
        }

        userRepository.save(user);
        notificationService.save(NotificationSaveRequestDto.builder()
                .notificationText(ENotificationTextBase.WELCOME_NOTIFICATION.getText())
                .userType(null)
                .userId(user.getId())
                .isRead(false)
                .notificationType(ENotificationType.SUCCESS)
                .url(HOME)
                .status(EStatus.ACTIVE)
                .build());
        return true;

    }

    public Auth saveAdmin(Auth auth) {
        if(authService.findByEmail(auth.getEmail()).isPresent())
        {
            throw new HumanResourcesAppException(ErrorType.EMAIL_TAKEN);
        }
        emailService.send(MailModel.builder().to(auth.getEmail()).subject("Your account is created").message("You can log in with email: " + auth.getEmail() + " and password: " + auth.getPassword()).build());
        String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(auth.getPassword());
        Auth saveAuth = Auth.builder()
                .email(auth.getEmail())
                .userType(EUserType.ADMIN)
                .password(encodedPassword)
                .status(EStatus.ACTIVE)
                .build();

        authService.save(saveAuth);

        User user = User.builder()
                .authId(saveAuth.getId())
                .email(auth.getEmail())
                .userType(EUserType.ADMIN)
                .status(EStatus.ACTIVE)
                .build();

        userRepository.save(user);

        return saveAuth;
    }

    public CountUserByTypeAndStatusDto countOfCustomersForGraph()
    {
        Long countOfActiveManagers = userRepository.countAllByUserTypeAndStatus(EUserType.MANAGER, EStatus.ACTIVE);
        Long countOfManagers = userRepository.countAllByUserType(EUserType.MANAGER);

        Long countOfActiveEmployees = userRepository.countAllByUserTypeAndStatus(EUserType.EMPLOYEE, EStatus.ACTIVE);
        Long countOfEmployees = userRepository.countAllByUserType(EUserType.EMPLOYEE);

        Long count = offerService.count();
        Long approvedOffers = offerService.countActiveOffers();



        return new CountUserByTypeAndStatusDto(countOfManagers, countOfActiveManagers, countOfEmployees, countOfActiveEmployees, count, approvedOffers);

    }

    public List<User> findEmployeesWithUpcomingBirthdays()
    {

        return userRepository.findEmployeesWithUpcomingBirthdays(EUserType.EMPLOYEE);

    }
}
