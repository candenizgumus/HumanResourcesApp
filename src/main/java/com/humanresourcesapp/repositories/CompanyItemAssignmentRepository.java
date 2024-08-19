package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.CompanyItemAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CompanyItemAssignmentRepository extends JpaRepository<CompanyItemAssignment, Long> {

    List<CompanyItemAssignment> findByEmployeeId(Long employeeId);

    List<CompanyItemAssignment> findByCompanyId(Long companyId);
}
