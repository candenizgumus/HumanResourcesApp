package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.TimeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeDataRepository extends JpaRepository<TimeData, Long> {
    @Query("SELECT DISTINCT t.userName FROM TimeData t WHERE t.companyId= :companyId")
    List<String> findAllDistinctUsernames(Long companyId);

    @Query("SELECT DISTINCT t.slideId FROM TimeData t WHERE t.userName = :username")
    List<Long> findAllUsernamesSlides(String username);

    List<TimeData> findAllByUserNameAndSlideIdAndCompanyId(String username,Long slideId,Long companyId);


    void deleteAllBySlideId(Long id);
}
