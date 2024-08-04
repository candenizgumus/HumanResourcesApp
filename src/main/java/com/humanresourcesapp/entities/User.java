package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EEmployeeType;
import com.humanresourcesapp.entities.enums.EPosition;
import com.humanresourcesapp.entities.enums.EUserType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;



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
    String department;

    // EMPLOYEE
    String title;

    // EMPLOYEE
    String location;

    //EMPLOYEE
    @Enumerated(EnumType.STRING)
    EEmployeeType employeeType;

    // ALL USERS
    String email;

    // ALL USERS
    String name;

    // ALL USERS
    String surname;

    // ALL USERS
    String phone;

    // MANAGER and EMPLOYEE
    Long birthDate;

    // MANAGER and EMPLOYEE
    Long hireDate;

    // MANAGER and EMPLOYEE
    String photo;

    // ALL USERS
    @Enumerated(EnumType.STRING)
    EUserType userType;

    // ALL USERS
    @Enumerated(EnumType.STRING)
    EPosition position;

}


