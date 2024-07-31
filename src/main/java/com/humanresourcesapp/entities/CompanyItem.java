package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name = "companyitems")
public class CompanyItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long companyId;
    private String name;
    private String description;
    @Builder.Default
    private EStatus status = EStatus.ACTIVE; //Base entity'nin statusunu default active olarak override eder. sadece manager companyitem ekleyebilir onaya gerek yok.

}
