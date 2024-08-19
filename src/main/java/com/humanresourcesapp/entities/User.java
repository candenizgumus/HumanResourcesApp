package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.*;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;


@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "users")

public class User extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    // MANAGER and EMPLOYEE
    Long companyId;

    // ALL USERS
    Long authId;

    // EMPLOYEE
    Long managerId;

    // EMPLOYEE
    String title;

    // EMPLOYEE
    String location;

    // EMPLOYEE
    Double salary;

    //EMPLOYEE
    String employeeType;

    // ALL USERS
    String email;

    // ALL USERS
    String name;

    // ALL USERS
    String surname;

    // ALL USERS
    String phone;

    // MANAGER and EMPLOYEE
    LocalDate birthDate;

    // MANAGER and EMPLOYEE
    LocalDate hireDate;

    // MANAGER and EMPLOYEE
    String profileImageId;

    @Column(length = 1000)
    String photo;

    // MANAGER and EMPLOYEE
    @Enumerated(EnumType.STRING)
    ESubscriptionType subscriptionType;

    // MANAGER and EMPLOYEE
    LocalDate subscriptionStartDate;
    LocalDate subscriptionEndDate;

    // ALL USERS
    @Enumerated(EnumType.STRING)
    EUserType userType;

    // ALL USERS
    String position;
    
    //
    @Enumerated(EnumType.STRING)
    ESectors sector;

    // EMPLOYEE
    Integer remainingAnnualLeave;

}


