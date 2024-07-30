package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company,Long>
{

}
