package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EPosition;
import com.humanresourcesapp.entities.enums.ESectors;
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
    Long managerId;
    String email;
    String name;
    String surname;
    String phone;
    Long birthDate;
    Long hireDate;
    @Enumerated(EnumType.STRING)
    EUserType userType;
    @Enumerated(EnumType.STRING)
    EPosition position;
    @Enumerated(EnumType.STRING)
    ESectors sector;

}


