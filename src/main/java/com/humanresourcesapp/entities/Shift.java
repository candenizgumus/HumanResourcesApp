package com.humanresourcesapp.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shifts")
@SuperBuilder
public class Shift extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long companyId;
    Long employeeId;
    String title;
    String description;
    LocalDateTime start;
    LocalDateTime endTime;
}
