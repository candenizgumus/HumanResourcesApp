package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.ECompanyItemType;
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
    @Enumerated(EnumType.STRING)
    private ECompanyItemType companyItemType;
    private String serialNumber;
    @Builder.Default
    private EStatus status = EStatus.AVAILABLE; //Base entity'nin statusunu default active olarak override eder. sadece manager companyitem ekleyebilir onaya gerek yok.
}
