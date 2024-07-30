package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EPosition;
import com.humanresourcesapp.entities.enums.EStatus;
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
@Table(name = "tbluser")

public class User extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long companyId;
    String email;
    String password;
    String name;
    String surname;
    EUserType userType;
    String activationCode;
    Long birthdate;
    Long hireDate;
    EPosition position;

}


