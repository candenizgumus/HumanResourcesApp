package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EDocumentType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "personaldocuments")
public class PersonalDocument extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long employeeId;
    @Enumerated(EnumType.STRING)
    EDocumentType documentType;
    String attachedFile;
    String description;
    String email;
    Long companyId;

}
