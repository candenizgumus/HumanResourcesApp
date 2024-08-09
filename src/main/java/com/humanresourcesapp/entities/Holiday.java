package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EHolidayType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

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
    Long holidayStartDate;
    Long holidayEndDate;
    Long companyId;
}


