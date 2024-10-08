package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long userId;
    Long companyId;
    @Enumerated(EnumType.STRING)
    ENotificationType notificationType;
    String notificationText;
    @Builder.Default
    Boolean isRead = false;
    EUserType userType;
    String url;
    @Enumerated(EnumType.STRING)
    EStatus status;
}