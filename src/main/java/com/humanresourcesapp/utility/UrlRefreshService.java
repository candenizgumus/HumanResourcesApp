package com.humanresourcesapp.utility;

import com.humanresourcesapp.configs.aws.S3Buckets;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.services.CompanyService;
import com.humanresourcesapp.services.PersonalDocumentService;
import com.humanresourcesapp.services.S3Service;
import com.humanresourcesapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UrlRefreshService {

    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final UserService userService;
    private final CompanyService companyService;
    private final PersonalDocumentService personalDocumentService;

    @Scheduled(cron = "0 0 0 */6 * ?")
    public void refreshPresignedUrls() {

        List<User> users = userService.findAll();
        List<Company>   companies = companyService.findAll();


        users.forEach(user -> {
            if (user.getProfileImageId() != null)
            {
                String newKey = s3Service.createPresignedGetUrl(s3Buckets.getCustomer(), "profile-images/%s/%s".formatted(user.getId(), user.getProfileImageId()));
                user.setPhoto(newKey);

                userService.save(user);

            }
        });


        companies.forEach(company -> {
            if (company.getCompanyImageId() != null)
            {
                String newKey = s3Service.createPresignedGetUrl(s3Buckets.getCustomer(), "company-images/%s/%s".formatted(company.getName()+"-"+company.getId(), company.getCompanyImageId()));
                company.setLogo(newKey);

                companyService.update(company);
            }
        });



    }
}
