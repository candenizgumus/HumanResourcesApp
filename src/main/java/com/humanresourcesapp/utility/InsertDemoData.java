package com.humanresourcesapp.utility;

import com.humanresourcesapp.dto.requests.OfferSaveRequestDto;
import com.humanresourcesapp.entities.*;
import com.humanresourcesapp.entities.enums.*;
import com.humanresourcesapp.services.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

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
    private final OfferService offerService;

    @PostConstruct
    public void insert() {
        insertCompanyDemoData();
        insertFeatureDemoData();
        insertCommentDemoData();
        insertHolidayDemoData();
        instertOfferDemoData();
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
                    .iconPath("recruitment.png")
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

            featureList.add(Feature.builder()
                    .name("Wage Evaluation")
                    .iconPath("salary.png")
                    .shortDescription("Update, manage and report employee salaries.")
                    .build());

            featureList.add(Feature.builder()
                    .name("HR Analytics")
                    .iconPath("analytics.png")
                    .shortDescription("Track your instant HR data on a single platform, make data-driven decisions.")
                    .build());

            featureList.add(Feature.builder()
                    .name("Staff")
                    .iconPath("staff.png")
                    .shortDescription("Manage all employee information in one application.")
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
                            .subscriptionType(ESubscriptionType.MONTHLY)
                    .build());


            User user = User
                    .builder()
                    .status(EStatus.ACTIVE)
                    .email(managerEmail)
                    .name("Snovid Sibiga")
                    .surname("Easy")
                    .authId(auth.getId())
                    .subscriptionType(ESubscriptionType.MONTHLY)
                    .subscriptionStartDate(auth.getSubscriptionStartDate())
                    .subscriptionEndDate(auth.getSubscriptionEndDate())
                    .location("Turkey")
                    .birthDate(LocalDate.of(1989, 1, 1))
                    .position(EPosition.CARTOGRAPHER)
                    .companyId(1L)
                    .phone("5555555555")
                    .photo("https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg")
                    .userType(EUserType.MANAGER)
                    .sector(ESectors.TECHNOLOGY)
                    .title("Turkey Operations Manager")
                    .build();
            userService.save(user);
        }
    }

    private void instertOfferDemoData()
    {


        offerService.save(new OfferSaveRequestDto(
                "Alice",
                "Johnson",
                "alice.johnson@example.com",
                "111111111",
                "Tech Corp",
                "Backend Developer",
                "8",
                ESectors.TECHNOLOGY
        ));

        offerService.save(new OfferSaveRequestDto(
                "Bob",
                "Smith",
                "bob.smith@example.com",
                "222222222",
                "Creative Studio",
                "Graphic Designer",
                "5",
                ESectors.AGRICULTURAL_SERVICES
        ));

        offerService.save(new OfferSaveRequestDto(
                "Charlie",
                "Brown",
                "charlie.brown@example.com",
                "333333333",
                "Health Solutions",
                "Nurse",
                "12",
                ESectors.HEALTHCARE
        ));

        offerService.save(new OfferSaveRequestDto(
                "David",
                "Clark",
                "david.clark@example.com",
                "444444444",
                "Finance World",
                "Financial Analyst",
                "7",
                ESectors.ACCOUNTING_SERVICES
        ));

        offerService.save(new OfferSaveRequestDto(
                "Eva",
                "Martin",
                "eva.martin@example.com",
                "555555555",
                "Marketing Pro",
                "Marketing Manager",
                "9",
                ESectors.MARKETING
        ));

        offerService.save(new OfferSaveRequestDto(
                "Frank",
                "Garcia",
                "frank.garcia@example.com",
                "666666666",
                "Eco Energy",
                "Environmental Engineer",
                "6",
                ESectors.CONSTRUCTION
        ));

        offerService.save(new OfferSaveRequestDto(
                "Grace",
                "Lee",
                "grace.lee@example.com",
                "777777777",
                "Retail Masters",
                "Store Manager",
                "11",
                ESectors.RETAIL
        ));

        offerService.save(new OfferSaveRequestDto(
                "Hank",
                "Moore",
                "hank.moore@example.com",
                "888888888",
                "Edu Innovators",
                "Teacher",
                "10",
                ESectors.EDUCATION
        ));

        offerService.save(new OfferSaveRequestDto(
                "Ivy",
                "Taylor",
                "ivy.taylor@example.com",
                "999999999",
                "Construction Hub",
                "Civil Engineer",
                "8",
                ESectors.CONSTRUCTION
        ));

        offerService.save(new OfferSaveRequestDto(
                "Jack",
                "Anderson",
                "jack.anderson@example.com",
                "101010101",
                "Legal Experts",
                "Lawyer",
                "15",
                ESectors.LEGAL
        ));

        offerService.save(new OfferSaveRequestDto(
                "Kate",
                "Thomas",
                "kate.thomas@example.com",
                "202020202",
                "Foodie World",
                "Chef",
                "5",
                ESectors.INVESTMENT_MANAGEMENT
        ));

        offerService.save(new OfferSaveRequestDto(
                "Leo",
                "Martinez",
                "leo.martinez@example.com",
                "303030303",
                "Travel Bliss",
                "Travel Agent",
                "7",
                ESectors.JOURNALISM
        ));

        offerService.save(new OfferSaveRequestDto(
                "Mia",
                "Harris",
                "mia.harris@example.com",
                "404040404",
                "Auto Experts",
                "Automotive Technician",
                "6",
                ESectors.AUTOMOTIVE
        ));

        offerService.save(new OfferSaveRequestDto(
                "Noah",
                "Nelson",
                "noah.nelson@example.com",
                "505050505",
                "Media World",
                "Journalist",
                "9",
                ESectors.MEDIA
        ));

        offerService.save(new OfferSaveRequestDto(
                "Olivia",
                "Scott",
                "olivia.scott@example.com",
                "606060606",
                "Beauty Bliss",
                "Cosmetologist",
                "10",
                ESectors.TOURISM
        ));


    }
}
