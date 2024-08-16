package com.humanresourcesapp.entities;


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
@Table(name = "leaves")
public class Leave extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    Long companyId;
    String employeeName;
    String employeeSurname;
    String description;
    LocalDate approveDate;
    LocalDate startDate;
    LocalDate endDate;
    @Builder.Default
    Boolean isLeaveApproved = false;
    String attachedFile;
    String leaveType;
    String fullName;
    String email;
    String responseMessage;
    String managerName;
}
