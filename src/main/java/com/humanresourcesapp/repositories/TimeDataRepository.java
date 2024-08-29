package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.TimeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeDataRepository extends JpaRepository<TimeData, Long> {
}
