package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Expenditure;
import com.humanresourcesapp.entities.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenditureRepository extends JpaRepository<Expenditure, Long> {
    @Query("select e from Expenditure e  where  e.description like %?1% AND e.employeeId = ?2 AND e.status != 'DELETED' ORDER BY e.id ASC")
    List<Expenditure> searchByEmployeeId(String description ,Long employeeId, PageRequest pageRequest);
    @Query("select e from Expenditure e  where  e.description like %?1% AND e.companyId = ?2 AND e.status != 'DELETED' ORDER BY e.id ASC")
    List<Expenditure> searchByCompanyId(String description ,Long companyId, PageRequest pageRequest);

    List<Expenditure> findAllByCompanyId(Long companyId);
}
