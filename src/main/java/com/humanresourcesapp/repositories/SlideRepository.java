package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Slide;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SlideRepository extends JpaRepository<Slide, Long> {
}
