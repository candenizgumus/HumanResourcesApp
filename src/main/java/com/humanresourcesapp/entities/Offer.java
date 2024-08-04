package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.ESectors;
import com.humanresourcesapp.entities.enums.EUserType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "tbloffer")
public class Offer extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    String surname;
    String email;
    String phone;
    String companyName;
    String title;
    String numberOfEmployee;
    @Enumerated(EnumType.STRING)
    EUserType userType;
    @Enumerated(EnumType.STRING)
    ESectors sector;
    Boolean approvalText;

}
