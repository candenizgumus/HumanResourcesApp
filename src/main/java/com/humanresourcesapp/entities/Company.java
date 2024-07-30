package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.ESubscriptionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor

@Data
@Entity
@Table(name = "tblcompany")
@SuperBuilder
public class Company extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    String email;
    ESubscriptionType subscriptionType;


}
