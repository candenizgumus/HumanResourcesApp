package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.views.VwGetCompanyLogos;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.swing.text.html.parser.Entity;
import java.util.List;

public interface CompanyRepository extends JpaRepository<Company,Long>
{
    @Query("select c from Company c  where c.name like %?1%")
    List<Company> getAllByPageBySearch(String name, PageRequest of);

    @Query("select new com.humanresourcesapp.views.VwGetCompanyLogos(c.id, c.name, c.logo) from Company c")
    List<VwGetCompanyLogos> findAllCompanyLogos();

    @Query("select Count(c) from Company c  where c.name like %?1%")
    Long getAllByPageBySearchCount(String name);

    @Query(value = "SELECT date_part('month', c.created_at) AS month, COUNT(c.id) " +
            "FROM tblcompany c " +
            "WHERE date_part('year', c.created_at) = ?1 " +
            "GROUP BY date_part('month', c.created_at)", nativeQuery = true)
    List<Object[]> countCompaniesByMonthForYear(int year);
}
