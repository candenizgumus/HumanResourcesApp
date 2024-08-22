package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.CompanyItemAssignment;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CompanyItemAssignmentRepository extends JpaRepository<CompanyItemAssignment, Long> {

    List<CompanyItemAssignment> findByEmployeeId(Long employeeId);

    List<CompanyItemAssignment> findByCompanyIdAndStatusNot(Long companyId, EStatus status);

    List<CompanyItemAssignment> findByEmployeeIdAndStatus(Long employeeId, EStatus status);

    Optional<CompanyItemAssignment> findByCompanyItemId(Long id);

}
