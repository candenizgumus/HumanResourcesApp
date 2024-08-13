package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EHolidayType;
import com.humanresourcesapp.entities.enums.EStatus;
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
@Table(name = "holidays")
public class Holiday extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String holidayName;
    @Enumerated(EnumType.STRING)
    EHolidayType holidayType;
    LocalDate startDate;
    LocalDate endDate;
    Long companyId;
    EStatus status;
}


