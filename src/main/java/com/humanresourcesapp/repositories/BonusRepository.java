package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Bonus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BonusRepository extends JpaRepository<Bonus,Long> {


}
