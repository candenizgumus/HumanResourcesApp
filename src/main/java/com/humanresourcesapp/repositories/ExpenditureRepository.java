package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Expenditure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenditureRepository extends JpaRepository<Expenditure, Long> {

}
