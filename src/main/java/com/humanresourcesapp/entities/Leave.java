package com.humanresourcesapp.entities;


import com.humanresourcesapp.entities.enums.ELeaveType;
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

    @Enumerated(EnumType.STRING)
    ELeaveType leaveType;

    String fullName;
    String email;
}
