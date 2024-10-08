package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Notification;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByUserIdAndIsReadAndStatus(Long userId, boolean isRead, EStatus status);

    List<Notification> findAllByUserTypeAndIsReadAndStatus(EUserType userType, boolean isRead, EStatus status);
    List<Notification> findAllByUserTypeAndIsReadAndStatusAndCompanyId(EUserType userType, boolean isRead, EStatus status, Long companyId);

    List<Notification> findAllByUserIdAndStatus(Long userId, EStatus status, PageRequest pageRequest);
    List<Notification> findAllByUserTypeAndStatus(EUserType userType, EStatus status, PageRequest pageRequest);

    List<Notification> findAllByUserTypeAndStatusAndCompanyId(EUserType userType, EStatus status, Long companyId, PageRequest of);
}
