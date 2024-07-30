package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@MappedSuperclass
public abstract class BaseEntity {
    @CreationTimestamp
    private Long createdAt;
    @UpdateTimestamp
    private Long updatedAt;
    @Enumerated(EnumType.STRING)
    EStatus status;
}
