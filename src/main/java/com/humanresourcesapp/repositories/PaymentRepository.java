package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Expenditure;
import com.humanresourcesapp.entities.Payment;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface PaymentRepository extends JpaRepository<Payment,Long> {
    List<Payment> findByDescriptionContainingAndCompanyIdAndStatus(String description, Long companyId, EStatus status, PageRequest pageRequest);

    @Query("SELECT p FROM Payment p WHERE p.companyId = ?1 AND YEAR(p.paymentDate) = YEAR(CURRENT_DATE)" +
            " AND MONTH(p.paymentDate) = MONTH(CURRENT_DATE) AND p.status = 'ACTIVE' ")
    List<Payment> findPaymentOfCurrentMonth(Long companyId);
}
