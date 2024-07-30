package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.CompanyItemAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CompanyItemAssignmentRepository extends JpaRepository<CompanyItemAssignment, Long> {

}
