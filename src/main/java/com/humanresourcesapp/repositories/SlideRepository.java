package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Slide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SlideRepository extends JpaRepository<Slide, Long> {
    List<Slide> findAllByCompanyId(Long companyId);


    List<Slide> findAllByCityContainingIgnoreCaseAndDistrictContainingIgnoreCaseAndNeighborhoodContainingIgnoreCaseAndProjectionContainingIgnoreCaseAndConceptContainingIgnoreCaseAndCompanyId
            ( String city, String district, String neighborhood, String projection, String concept,Long companyId);


    /*@Query("SELECT DISTINCT s.city FROM Slide s WHERE s.companyId = :companyId")
    List<String> findDistinctCityNamesByCompanyId(@Param("companyId") Long companyId);*/
}
