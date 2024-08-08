package com.humanresourcesapp.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comments")
@SuperBuilder
public class Comment extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Long managerId;
    private Long companyId;
    @Column(length = 255)
    private String shortDescription;
    @Column(length = 1500)
    private String longDescription;
    @Column(length = 255)
    private String photo;
}
