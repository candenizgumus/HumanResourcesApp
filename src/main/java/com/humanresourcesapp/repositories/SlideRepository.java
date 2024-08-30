package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Slide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SlideRepository extends JpaRepository<Slide, Long> {
    List<Slide> findAllBy(Long companyId);

    List<Slide> findAllByCompanyId(Long companyId);
}
