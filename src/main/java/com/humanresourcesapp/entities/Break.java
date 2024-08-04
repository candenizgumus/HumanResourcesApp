package com.humanresourcesapp.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "breaks")
@SuperBuilder
public class Break extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Long employeeId;
    private Long shiftId;

    private Long breakStartTime;
    private Long breakEndTime;
}
