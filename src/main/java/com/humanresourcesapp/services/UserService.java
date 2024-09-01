package com.humanresourcesapp.services;

import com.humanresourcesapp.configs.aws.S3Buckets;
import com.humanresourcesapp.constants.ENotificationTextBase;
import com.humanresourcesapp.dto.requests.*;
import com.humanresourcesapp.dto.responses.CompanyNameResponseDto;
import com.humanresourcesapp.dto.responses.CountUserByTypeAndStatusDto;
import com.humanresourcesapp.dto.responses.ManagerAndCompanyNameOfEmployee;
import com.humanresourcesapp.dto.responses.MonthlySalaryOfEmployeesDto;
import com.humanresourcesapp.entities.*;
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

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
    private  ExpenditureService expenditureService;
    private OfferService offerService;
    private BonusService bonusService;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    @Autowired
    public void setOfferService(@Lazy OfferService offerService , @Lazy ExpenditureService expenditureService, @Lazy BonusService bonusService) {
        this.offerService = offerService;
        this.expenditureService = expenditureService;
        this.bonusService = bonusService;
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
        List<User> allUserByEmailSearch = userRepository.getAllUserByEmailSearch(dto.searchText(),
                PageRequest.of(dto.page(),
                        dto.pageSize()));

//        allUserByEmailSearch.forEach(user -> {
//                    String profileImageUrl = null;
//                    try {
//                        profileImageUrl = s3Service.createPresignedGetUrl(
//                                s3Buckets.getCustomer(), "profile-images/%s/%s".formatted(user.getId(), user.getProfileImageId()));
//                    } catch (Exception e) {
//                        System.out.println(e.getMessage());
//                        System.err.println("Failed to generate S3 URL for player: " + user.getId());
//                    }
//                    user.setPhoto(profileImageUrl);
//                }
//        );
        return allUserByEmailSearch;
    }

    public void uploadPlayerProfileImage(MultipartFile file, Authentication authentication) {
        User profileByEmail = findByEmail(authentication.getName())
                .orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        String profileImageId = UUID.randomUUID().toString();
        String existingProfileImageId = profileByEmail.getProfileImageId(); // Store the old image ID

        try {
            // Delete the old file in the S3 bucket if it exists
            if (existingProfileImageId != null && !existingProfileImageId.isEmpty()) {
                s3Service.deleteObject(s3Buckets.getCustomer(),
                        "profile-images/%s/%s".formatted(profileByEmail.getId(), existingProfileImageId));
            }

            // Upload the new file
            s3Service.putObject(s3Buckets.getCustomer(),
                    "profile-images/%s/%s".formatted(profileByEmail.getId(), profileImageId),
                    file.getBytes()
            );

            String profileImageUrl = s3Service.createPresignedGetUrl(
                    s3Buckets.getCustomer(), "profile-images/%s/%s".formatted(profileByEmail.getId(), profileImageId));

            profileByEmail.setProfileImageId(profileImageId);
            profileByEmail.setPhoto(profileImageUrl);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        userRepository.save(profileByEmail);
    }

//    public void updatePlayerProfileImageId(String imageId, String playerEmail) {
//        User user = userRepository.findByEmail(playerEmail).orElseThrow();
//        user.setProfileImageId(imageId);
//        user.setPhoto(profileImageUrl);
//        userRepository.save(user);
//    }

    public List<User> getAllUsersOfManagerByCompanyId(PageRequestDto dto) {

        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userRepository.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return userRepository.findAllUsersByEmailAndCompanyId(dto.searchText(), manager.getCompanyId(), PageRequest.of(dto.page(), dto.pageSize()));
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.ID_NOT_FOUND));
    }

//    public User addEmployeeToCompany(AddEmployeeToCompanyRequestDto dto) {
//        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
//        User manager = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
//
//        //Checking email and phone
//        if (userRepository.findByEmailAndPhone(dto.email(), dto.phone()).isPresent()) {
//            throw new HumanResourcesAppException(ErrorType.EMAIL_OR_PHONE_TAKEN);
//        }
//
//        //Generating new password for customer
//        String newPassword = PasswordGenerator.generatePassword();
//        String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(newPassword);
//
//        //Send email with new password
//        emailService.send(MailModel.builder().to(dto.email()).subject("Your new password").message("Your new password is: " + newPassword).build());
//
//        //Creating new auth and user entities for new employee.
//
//        Auth auth = authService.save(Auth
//                .builder()
//                .email(dto.email())
//                .password(encodedPassword)
//                .userType(EUserType.EMPLOYEE)
//                .status(EStatus.ACTIVE)
//                        .subscriptionType(manager.getSubscriptionType())
//                        .subscriptionStartDate(manager.getSubscriptionStartDate())
//                        .subscriptionEndDate(manager.getSubscriptionEndDate())
//                .build()
//        );
//
//        User employee = userRepository.save(User
//                .builder()
//                .authId(auth.getId())
//                .email(dto.email())
//                .phone(dto.phone())
//                .name(dto.name())
//                .surname(dto.surname())
//                .companyId(manager.getCompanyId())
//                .userType(EUserType.EMPLOYEE)
//                .hireDate(dto.hireDate().plusDays(1))
//                .birthDate(dto.birthDate().plusDays(1))
//                .status(EStatus.ACTIVE)
//                .position(dto.position())
//                .position(dto.position())
//                .location(dto.location())
//                .remainingAnnualLeave(0)
//                .title(dto.title())
//                .sector(manager.getSector())
//                .employeeType(dto.employeeType())
//                .subscriptionType(manager.getSubscriptionType())
//                .subscriptionStartDate(manager.getSubscriptionStartDate())
//                .subscriptionEndDate(manager.getSubscriptionEndDate())
//                .salary(dto.salary())
//                .build());
//
//        //Increasing number of employee in company
//        companyService.findById(manager.getCompanyId()).ifPresent(c-> {
//            c.setNumberOfEmployee(c.getNumberOfEmployee() + 1);
//            companyService.update(c);
//        });
//        User save = userRepository.save(employee);
//        notificationService.save(NotificationSaveRequestDto.builder()
//                .notificationText(ENotificationTextBase.WELCOME_NOTIFICATION.getText())
//                .userType(null)
//                .userId(save.getId())
//                .isRead(false)
//                .notificationType(ENotificationType.SUCCESS)
//                .url(HOME)
//                .status(EStatus.ACTIVE)
//                .build());
//        return save;
//    }
    public  boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }

        // Email düzenli ifadesi (regex)
        String emailRegex = "^[\\w-_.+]+@[\\w-]+\\.[a-zA-Z]{2,}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);

        return matcher.matches();
    }


    public User addEmployeeToCompany2(AddEmployeeToCompanyRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        //Checking email and phone
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new HumanResourcesAppException(ErrorType.EMAIL_OR_PHONE_TAKEN);
        }
        if (userRepository.findByEmail(dto.phone()).isPresent()) {
            throw new HumanResourcesAppException(ErrorType.EMAIL_OR_PHONE_TAKEN);
        }

        if (!isValidEmail(dto.email()))
        {
            throw new HumanResourcesAppException(ErrorType.EMAIL_NOT_VALID);
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
                .hireDate(dto.hireDate().plusDays(1))
                .birthDate(dto.birthDate().plusDays(1))
                .status(EStatus.ACTIVE)
                .position(dto.position())
                .position(dto.position())
                .location(dto.location())
                .remainingAnnualLeave(0)
                .title(dto.title())
                .sector(manager.getSector())
                .employeeType(dto.employeeType())
                .subscriptionType(manager.getSubscriptionType())
                .subscriptionStartDate(manager.getSubscriptionStartDate())
                .subscriptionEndDate(manager.getSubscriptionEndDate())
                .salary(dto.salary())
                .managerId(manager.getId())
                .build());

        //Increasing number of employee in company
        companyService.findById(manager.getCompanyId()).ifPresent(c-> {
            c.setNumberOfEmployee(c.getNumberOfEmployee() + 1);
            companyService.update(c);
        });

        if (dto.photo() != null)
        {
            String profileImageId = UUID.randomUUID().toString();
            String existingProfileImageId = employee.getProfileImageId(); // Store the old image ID

            try {
                // Delete the old file in the S3 bucket if it exists
                if (existingProfileImageId != null && !existingProfileImageId.isEmpty()) {
                    s3Service.deleteObject(s3Buckets.getCustomer(),
                            "profile-images/%s/%s".formatted(employee.getId(), existingProfileImageId));
                }

                // Upload the new file
                s3Service.putObject(s3Buckets.getCustomer(),
                        "profile-images/%s/%s".formatted(employee.getId(), profileImageId),
                        dto.photo().getBytes()
                );

                String profileImageUrl = s3Service.createPresignedGetUrl(
                        s3Buckets.getCustomer(), "profile-images/%s/%s".formatted(employee.getId(), profileImageId));

                employee.setProfileImageId(profileImageId);
                employee.setPhoto(profileImageUrl);

            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }





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

    public CompanyNameResponseDto findCompanyNameOfUser() {

        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        String companyName = null;
        String managerName = null;
        if ( user.getCompanyId() != null) {
            Company company = companyService.findById(user.getCompanyId()).get();
            companyName = company.getName();


        }
        return new CompanyNameResponseDto(companyName);
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
            user.setBirthDate(dto.birthDate().plusDays(1));
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
                List<User> userList = userRepository.findAllByCompanyId(user.getCompanyId());
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
        if (user.getStatus() == EStatus.DELETED)
        {
            throw new HumanResourcesAppException(ErrorType.USER_ALREADY_DELETED);
        }
        user.setStatus(EStatus.DELETED);
        emailService.send(MailModel.builder().to(user.getEmail()).subject("Your account is deleted").message("Your account is deleted").build());
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
        if (!Objects.equals(manager.getCompanyId(), user.getCompanyId()))
        {
            throw new HumanResourcesAppException(ErrorType.INSUFFICIENT_PERMISSION);
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
            user.setBirthDate(dto.birthDate().plusDays(1));
        }

        if (dto.hireDate() != null)
        {
            user.setHireDate(dto.hireDate().plusDays(1));
        }
        if (dto.location() != null)
        {
            user.setLocation(dto.location());
        }
        if (!dto.employeeType().isEmpty())
        {
            user.setEmployeeType(dto.employeeType());
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
            emailService.send(MailModel.builder().to(user.getEmail()).subject("Your account is activated").message("You can log in with email: " + user.getEmail()).build());
            //Setting companyEmployee count
            companyService.findById(user.getCompanyId()).ifPresent(company -> {
                company.setNumberOfEmployee(company.getNumberOfEmployee() + 1);
                companyService.update(company);
            });
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
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return userRepository.findEmployeesWithUpcomingBirthdays(EUserType.EMPLOYEE, manager.getCompanyId());

    }


    public List<MonthlySalaryOfEmployeesDto> findMonthlySalaryOfEmployees()
    {
        List<MonthlySalaryOfEmployeesDto> monthlySalaryOfEmployeesDtos = new ArrayList<>();
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        List<User> employees = userRepository.findAllByCompanyIdAndStatusAndUserType(manager.getCompanyId(), EStatus.ACTIVE,EUserType.EMPLOYEE);
        List<Expenditure> expendituresOfEmployees = expenditureService.findExpendituresByCompanyIdAndCurrentMonth(manager.getCompanyId());

        //Adding empty employees to monthly salary list
        employees.forEach(e -> {

            monthlySalaryOfEmployeesDtos.add(new MonthlySalaryOfEmployeesDto(e.getId(),e.getName(),e.getSurname(),e.getEmail(),e.getSalary(),0.00,0.00,e.getSalary() ));

        });

        //Adding salary and extra payments to each employee
        monthlySalaryOfEmployeesDtos.forEach(e -> {
            expendituresOfEmployees.forEach(expenditure -> {

                if (expenditure.getEmployeeId().equals(e.getId()))
                {
                    e.setExtraPayments(e.getExtraPayments() + expenditure.getPrice()); // Add to extra payments
                    e.setTotal(e.getSalary() + expenditure.getPrice());
                }
            });
        });

        //Adding bonuses to each employee
        bonusService.findMonthlyBonusesOfEmployees().forEach(bonus -> {

            monthlySalaryOfEmployeesDtos.forEach(e -> {
                if (bonus.getEmployeeId().equals(e.getId()))
                {
                    e.setBonus(e.getBonus() + bonus.getBonusAmount()); // Accumulate bonuses
                    e.setTotal(e.getTotal() + bonus.getBonusAmount());
                }
            });
        });

        return monthlySalaryOfEmployeesDtos;

    }

    public Auth createUserWithUserType(CreateUserRequestDto dto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        if(user.getUserType().equals(EUserType.MANAGER) && dto.userType().equals(EUserType.ADMIN))
            throw new HumanResourcesAppException(ErrorType.INSUFFICIENT_PERMISSION);

        if(authService.findByEmail(dto.email()).isPresent())
        {
            throw new HumanResourcesAppException(ErrorType.EMAIL_TAKEN);
        }
        emailService.send(MailModel.builder().to(dto.email()).subject("Your account is created").message("You can log in with email: " + dto.email() + " and password: " + dto.password()).build());
        String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(dto.password());
        Auth saveAuth = Auth.builder()
                .email(dto.email())
                .userType(dto.userType())
                .password(encodedPassword)
                .status(EStatus.ACTIVE)
                .build();

        authService.save(saveAuth);

        User saveUser = User.builder()
                .authId(saveAuth.getId())
                .email(dto.email())
                .userType(dto.userType())
                .status(EStatus.ACTIVE)
                .companyId(user.getCompanyId())
                .sector(user.getSector())
                .subscriptionEndDate(user.getSubscriptionEndDate())
                .subscriptionStartDate(user.getSubscriptionStartDate())
                .subscriptionType(user.getSubscriptionType())
                .build();

        userRepository.save(saveUser);

        if (dto.userType() == EUserType.MANAGER)
        {
            //adding company employee count
            companyService.findById(user.getCompanyId()).ifPresent(company -> {
                company.setNumberOfEmployee(company.getNumberOfEmployee() + 1);
                companyService.update(company);
            });
        }


        return saveAuth;
    }

    public User findByAuthId(Long authId) {
        User user = userRepository.findByAuthId(authId).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return user;
    }

    public List<User> findAllByCompanyId(Long companyId) {
        return userRepository.findAllByCompanyId(companyId);
    }

    public List<Long> findDistinctCompanyIdsWithSubscriptionEndingSoon(LocalDate now, LocalDate endRange) {
        return userRepository.findDistinctCompanyIdsWithSubscriptionEndingSoon(now, endRange);
    }

    public Optional<User> findFirstUserByCompanyId(Long companyId) {
        return userRepository.findFirstUserByCompanyId(companyId);
    }

    public ManagerAndCompanyNameOfEmployee findManagerAndCompanyNameOfEmployee()
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        Company company = companyService.findById(user.getCompanyId()).orElse(null);

        ManagerAndCompanyNameOfEmployee managerAndCompanyNameOfEmployee;
        assert company != null;
        if(user.getUserType().equals(EUserType.MANAGER)) {
            managerAndCompanyNameOfEmployee = new ManagerAndCompanyNameOfEmployee(null, company.getName());
        } else {
            User manager = userRepository.findById(user.getManagerId()).orElse(null);
            assert manager != null;
            managerAndCompanyNameOfEmployee = new ManagerAndCompanyNameOfEmployee(manager.getName() + " " + manager.getSurname(), company.getName());
        }
        return managerAndCompanyNameOfEmployee;
    }

    public List<User> findAllByUserTypeAndStatusAndCompanyId(EUserType userType, EStatus status, Long companyId) {
        return userRepository.findAllByUserTypeAndStatusAndCompanyId(userType,status,companyId);
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }



}
