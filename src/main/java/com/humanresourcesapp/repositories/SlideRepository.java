package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Slide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SlideRepository extends JpaRepository<Slide, UUID> {
    List<Slide> findAllByCompanyId(Long companyId);
}
