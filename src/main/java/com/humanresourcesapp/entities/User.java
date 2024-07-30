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
@Table(name = "users")

public class User extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long companyId;
    Long authId;
    String email;
    String name;
    String surname;
    Long birthdate;
    Long hireDate;
    @Enumerated(EnumType.STRING)
    EUserType userType;
    @Enumerated(EnumType.STRING)
    EPosition position;

}


