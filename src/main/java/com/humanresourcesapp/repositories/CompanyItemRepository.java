package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.CompanyItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyItemRepository extends JpaRepository<CompanyItem, Long> {

}
