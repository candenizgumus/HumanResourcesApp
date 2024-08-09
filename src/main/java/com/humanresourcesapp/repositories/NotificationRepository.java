package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.entities.enums.EUserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByUserId(Long userId);

    List<Notification> findAllByUserType(EUserType userType);
}
