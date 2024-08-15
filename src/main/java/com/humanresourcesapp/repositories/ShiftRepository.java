package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift,Long> {
    List<Shift> findAllByEmployeeId(Long employeeId);
}
