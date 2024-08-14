package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Bonus;
import com.humanresourcesapp.entities.Payment;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;



public interface BonusRepository extends JpaRepository<Bonus,Long> {

    List<Bonus> findByEmailContainingAndCompanyIdAndStatus(String description, Long companyId, EStatus status, PageRequest pageRequest);
    List<Bonus> findAllByBonusDateIsBetweenAndCompanyIdAndStatus(LocalDate startDate, LocalDate endDate, Long companyId, EStatus status);
}
