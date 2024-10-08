package com.humanresourcesapp.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "expenditures")
public class Expenditure extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long employeeId;
    Long companyId;
    String employeeName;
    String employeeSurname;
    String description;
    Double price;
    LocalDate approveDate;
    @Builder.Default
    Boolean isExpenditureApproved = false;
    //stores key from aws s3
    String attachedFile;
}
