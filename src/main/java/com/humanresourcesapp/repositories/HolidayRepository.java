package com.humanresourcesapp.repositories;

import com.humanresourcesapp.dto.responses.HolidayResponseDto;
import com.humanresourcesapp.entities.Holiday;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findByCompanyId(Long companyId);
    List<Holiday> findByCompanyIdAndStatus(Long companyId, EStatus status);
}
