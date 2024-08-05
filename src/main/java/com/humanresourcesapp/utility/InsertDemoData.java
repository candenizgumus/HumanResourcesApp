package com.humanresourcesapp.utility;

import com.humanresourcesapp.entities.*;
import com.humanresourcesapp.entities.enums.EHolidayType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.services.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class InsertDemoData {
    private final CompanyService companyService;
    private final FeatureService featureService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;
    private final CommentService commentService;
    private final HolidayService holidayService;

    @PostConstruct
    public void insert() {
        insertCompanyDemoData();
        insertFeatureDemoData();
        insertCommentDemoData();
        insertHolidayDemoData();
    }

    // Company demo data insertion
    private void insertCompanyDemoData() {
        if(companyService.getAll().isEmpty()) {
            List<Company> companyList = new ArrayList<>();
            companyList.add(Company.builder()
                    .name("Airbnb")
                    .logo("https://asset.brandfetch.io/idkuvXnjOH/idxMw0tmPe.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Nike")
                    .logo("https://asset.brandfetch.io/id_0dwKPKT/id_GjBr_LQ.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Puma")
                    .logo("https://asset.brandfetch.io/idDV9AjI6R/idt8Kf_9bU.svg")
                    .build());

            companyList.add(Company.builder()
                    .name("McDonald's")
                    .logo("https://asset.brandfetch.io/id7ETzoB9W/idqHifpuke.png")
                    .build());

            companyList.add(Company.builder()
                    .name("HSBC")
                    .logo("https://asset.brandfetch.io/idLLTco_Zw/idpShkJ2yo.svg")
                    .build());

            companyList.add(Company.builder()
                    .name("Tesla")
                    .logo("https://asset.brandfetch.io/id2S-kXbuK/idL-smlY7j.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Spotify")
                    .logo("https://asset.brandfetch.io/id20mQyGeY/idZi0Z5Y9U.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Apple")
                    .logo("https://asset.brandfetch.io/idnrCPuv87/idzou3XgJV.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Amazon")
                    .logo("https://asset.brandfetch.io/idawOgYOsG/idK5GFOo3t.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Google")
                    .logo("https://asset.brandfetch.io/id6O2oGzv-/idSuJ5ik7i.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Microsoft")
                    .logo("https://asset.brandfetch.io/idchmboHEZ/id-ypZheVL.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Facebook")
                    .logo("https://asset.brandfetch.io/idpKX136kp/idQbJ8ZEuI.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Twitter")
                    .logo("https://asset.brandfetch.io/idS5WhqBbM/idrn8jLjIE.png")
                    .build());

            companyList.add(Company.builder()
                    .name("Netflix")
                    .logo("https://asset.brandfetch.io/ideQwN5lBE/idAVFyOJN0.png")
                    .build());

            companyService.saveAll(companyList);
        }
    }

    // Feature demo data insertion
    private void insertFeatureDemoData() {
        if(featureService.getAll().isEmpty()) {
            List<Feature> featureList = new ArrayList<>();
            featureList.add(Feature.builder()
                    .name("Recruitment")
                    .iconPath("target.png")
                    .shortDescription("Manage your recruitment processes from a single platform.")
                    .build());

            featureList.add(Feature.builder()
                    .name("Performance")
                    .iconPath("performance.png")
                    .shortDescription("Involve employees in online performance appraisal.")
                    .build());

            featureList.add(Feature.builder()
                    .name("Shift")
                    .iconPath("shift.png")
                    .shortDescription("Plan and manage your working time in the most efficient way.")
                    .build());

            featureService.saveAll(featureList);
        }
    }


    // Comment demo data insertion
    private void insertCommentDemoData() {
        List<Comment> commentList = new ArrayList<>();
        createManagerUser();
        User manager = userService.findByEmail("manager").orElseThrow(() -> new RuntimeException("Manager not found"));
        commentList.add(Comment.builder()
                        .companyId(1L)
                        .managerId(manager.getId())
                        .commentText("A platform that can be easily used by employees of all levels, where HR processes can be managed smoothly and independently of the person")
                        .photo("https://xsgames.co/randomusers/avatar.php?g=male")

                .build());
        commentList.add(Comment.builder()
                .companyId(1L)
                .managerId(manager.getId())
                .commentText("Before we met Kolay HR, we were very primitive in terms of personnel and leave management compared to today.")
                .photo("https://xsgames.co/randomusers/avatar.php?g=male")

                .build());

        commentList.add(Comment.builder()
                .companyId(1L)
                .managerId(manager.getId())
                .commentText("We have experienced an evolution from disorder to order in our human resources processes with Kolay HR!")
                .photo("https://xsgames.co/randomusers/avatar.php?g=male")

                .build());
        commentService.saveAll(commentList);
    }

    private void insertHolidayDemoData() {
        List <Holiday> holidayList = new ArrayList<>();

        holidayList.add(Holiday.builder()
                .holidayName("29 EKİM")
                .holidayType(EHolidayType.NATIONAL)
                .holidayStartDate(1730182819L)
                .holidayEndDate(1730269219L)
                .build());

        holidayList.add(Holiday.builder()
                .holidayName("KURBAN BAYRAMI")
                .holidayType(EHolidayType.RELIGIOUS)
                .holidayStartDate(1749190819L)
                .holidayEndDate(1749450019L)
                .build());

        holidayList.add(Holiday.builder()
                .holidayName("RAMAZAN BAYRAMI")
                .holidayType(EHolidayType.RELIGIOUS)
                .holidayStartDate(1743315619L)
                .holidayEndDate(1743488419L)
                .build());

        holidayList.add(Holiday.builder()
                .holidayName("YILBAŞI")
                .holidayType(EHolidayType.INTERNATIONAL)
                .holidayStartDate(1735626019L)
                .holidayEndDate(1735712419L)
                .build());

        holidayList.add(Holiday.builder()
                .holidayName("23 NİSAN")
                .holidayType(EHolidayType.NATIONAL)
                .holidayStartDate(1745389219L)
                .holidayEndDate(1745475619L)
                .build());

        holidayList.add(Holiday.builder()
                .holidayName("30 AĞUSTOS")
                .holidayType(EHolidayType.NATIONAL)
                .holidayStartDate(1756534819L)
                .holidayEndDate(1756621219L)
                .build());

        holidayList.add(Holiday.builder()
                .holidayName("1 MAYIS")
                .holidayType(EHolidayType.NATIONAL)
                .holidayStartDate(1746080419L)
                .holidayEndDate(1746166819L)
                .build());

        holidayService.saveAll(holidayList);
    }

    private void createManagerUser()
    {
        String managerEmail = "manager";
        String password = "123";

        if (authService.findByEmail(managerEmail).isEmpty())
        {
            String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(password);

            Auth auth = authService.save(Auth.
                    builder()
                    .status(EStatus.ACTIVE)
                    .email(managerEmail)
                    .password(encodedPassword)
                    .userType(EUserType.MANAGER)
                    .build());

            User user = User
                    .builder()
                    .status(EStatus.ACTIVE)
                    .email(managerEmail)
                    .name("Snovid Sibiga")
                    .authId(auth.getId())
                    .companyId(1L)
                    .userType(EUserType.MANAGER)
                    .title("Turkey Operations Manager")
                    .build();
            userService.save(user);
        }
    }
}
