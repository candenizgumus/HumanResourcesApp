package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public abstract class BaseEntity
{
    @CreationTimestamp
    private Long createdAt;
    @UpdateTimestamp
    private Long updatedAt;
    @Enumerated(EnumType.STRING)
    EStatus status;
}
