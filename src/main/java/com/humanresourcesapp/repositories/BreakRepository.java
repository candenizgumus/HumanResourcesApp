package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Break;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BreakRepository extends JpaRepository<Break,Long> {
}
