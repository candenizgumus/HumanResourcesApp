package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.ENotificationType;
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
    @Enumerated(EnumType.STRING)
    ENotificationType notificationType;
    String notificationText;
    @Builder.Default
    Boolean isRead = false;
}