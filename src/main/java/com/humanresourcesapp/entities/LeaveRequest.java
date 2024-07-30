package com.humanresourcesapp.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "leaverequests")
@SuperBuilder
public class LeaveRequest extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int requestId;

    private int employeeId;

    private int leaveId;

    private Long requestDate;

    private String approvalStatus;

    private Long responseDate;
}
