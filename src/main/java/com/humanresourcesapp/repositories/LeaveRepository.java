package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

}
