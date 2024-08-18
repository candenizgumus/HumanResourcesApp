package com.humanresourcesapp.services;

import com.humanresourcesapp.configs.aws.S3Buckets;
import com.humanresourcesapp.dto.requests.CompanySaveRequestDto;
import com.humanresourcesapp.dto.requests.PageCountRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.UpdateCompanyByManagerDto;
import com.humanresourcesapp.entities.BaseEntity;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.CompanyRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import com.humanresourcesapp.utility.UtilMethods;
import com.humanresourcesapp.views.VwGetCompanyLogos;
import com.humanresourcesapp.views.VwUpcomingMembershipExpiry;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService
{
    private final CompanyRepository companyRepository;
    private UserService userService;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    //To break circular reference in UserService
    @Autowired
    public void setUserService(@Lazy UserService userService) {
        this.userService = userService;
    }


    public Company save(CompanySaveRequestDto dto)
    {
        Company company = Company.builder().name(dto.name()).numberOfEmployee(dto.numberOfEmployee()).logo(dto.logo()).build();
        company.setStatus(EStatus.ACTIVE);
        return companyRepository.save(company);
    }

    public Company update(Company company)
    {
        return companyRepository.save(company);
    }

    public Optional<Company> findById(Long id)
    {
        return companyRepository.findById(id);
    }

    public List<VwGetCompanyLogos> getAll() {
        return companyRepository.findAllCompanyLogos().stream()
                .filter(logo -> logo.getLogo() != null && !logo.getLogo().isEmpty())
                .collect(Collectors.toList());
    }

    public void saveAll(List<Company> companyList) {
        companyRepository.saveAll(companyList);
    }

    public List<Company> getAllByPage(PageRequestDto dto) {
        return companyRepository.getAllByPageBySearch(dto.searchText(),PageRequest.of(dto.page(), dto.pageSize()));
    }

    public Company update (CompanySaveRequestDto dto){
        Company company = companyRepository.findById(dto.id()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.COMPANY_NOT_FOUND));
        if(!UtilMethods.isNullOrWhitespace(dto.name())){
            company.setName(dto.name());
        }
        if (!UtilMethods.isNullOrWhitespace(dto.logo())){
            company.setLogo(dto.logo());
        }
        if (!UtilMethods.isNullOrWhitespace(dto.description())){
            company.setDescription(dto.description());
        }
        if (dto.numberOfEmployee() != null){
            company.setNumberOfEmployee(dto.numberOfEmployee());
        }

        return companyRepository.save(company);
    }

    public Long getCount(PageCountRequestDto dto) {
        return companyRepository.getAllByPageBySearchCount(dto.searchText());
    }

    public Map<Integer, Long> getCompanyCountByMonthForCurrentYear() {
        int currentYear = LocalDate.now().getYear();
        List<Object[]> results = companyRepository.countCompaniesByMonthForYear(currentYear);

        return results.stream()
                .collect(Collectors.toMap(
                        result -> ((Number) result[0]).intValue(),
                        result -> ((Number) result[1]).longValue()
                ));
    }

    public Company getCompanyOfManager()
    {

        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return companyRepository.findById(manager.getCompanyId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.COMPANY_NOT_FOUND));
    }

    public Company updateCompanyByManager(UpdateCompanyByManagerDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        Company company = companyRepository.findById(manager.getCompanyId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.COMPANY_NOT_FOUND));

        if (dto.country() != null)
        {
            company.setCountry(dto.country());
        }
        if (dto.description() != null)
        {
            company.setDescription(dto.description());
        }

        if (dto.name() != null)
        {
            company.setName(dto.name());
        }


        return companyRepository.save(company);

    }

    public List<VwUpcomingMembershipExpiry> getUpcomingMembershipExpiries() {
        List<VwUpcomingMembershipExpiry> vwUpcomingMembershipExpiries = new ArrayList<>();
        LocalDate now = LocalDate.now();
        LocalDate endRange = now.plusDays(7);
        List<Long> companyIdList = userService.findDistinctCompanyIdsWithSubscriptionEndingSoon(now, endRange);
        companyRepository.findAllById(companyIdList).forEach(company -> {
            User manager = userService.findFirstUserByCompanyId(company.getId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
            vwUpcomingMembershipExpiries.add(VwUpcomingMembershipExpiry
                    .builder()
                    .id(company.getId())
                    .name(company.getName())
                    .logo(company.getLogo())
                    .numberOfEmployee(company.getNumberOfEmployee())
                    .status(company.getStatus().name())
                    .contactEmail(manager.getEmail())
                    .subscriptionType(manager.getSubscriptionType().name())
                    .subscriptionStartDate(manager.getSubscriptionStartDate())
                    .subscriptionEndDate(manager.getSubscriptionEndDate())
                    .build());
        });
        return vwUpcomingMembershipExpiries;
    }

    public Company updateWithPhoto(String name, String description, String country, MultipartFile photo)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        Company company = companyRepository.findById(manager.getCompanyId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.COMPANY_NOT_FOUND));

        if (country != null)
        {
            company.setCountry(country);
        }
        if (description != null)
        {
            company.setDescription(description);
        }

        if (name != null)
        {
            company.setName(name);
        }


        if (photo != null)
        {
            String companyImageId = UUID.randomUUID().toString();
            String existingProfileImageId = company.getCompanyImageId(); // Store the old image ID

            try {
                // Delete the old file in the S3 bucket if it exists
                if (existingProfileImageId != null && !existingProfileImageId.isEmpty()) {
                    s3Service.deleteObject(s3Buckets.getCustomer(),
                            "profile-images/%s/%s".formatted(company.getId(), existingProfileImageId));
                }

                // Upload the new file
                s3Service.putObject(s3Buckets.getCustomer(),
                        "profile-images/%s/%s".formatted(company.getId(), companyImageId),
                        photo.getBytes()
                );

                String profileImageUrl = s3Service.createPresignedGetUrl(
                        s3Buckets.getCustomer(), "profile-images/%s/%s".formatted(company.getId(), companyImageId));

                company.setCompanyImageId(companyImageId);
                company.setLogo(profileImageUrl);

            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return companyRepository.save(company);
    }
}
