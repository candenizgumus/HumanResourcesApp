package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Payment;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PaymentRepository extends JpaRepository<Payment,Long> {
    List<Payment> findByDescriptionContainingAndCompanyIdAndStatus(String description, Long companyId, EStatus status, PageRequest pageRequest);

}
