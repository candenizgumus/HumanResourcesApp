package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.definitions.DLeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DLeaveTypeRepository extends JpaRepository<DLeaveType, Long> {
    Optional<DLeaveType> findByName(String name);
}
