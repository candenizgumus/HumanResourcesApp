package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Expenditure;
import com.humanresourcesapp.entities.Leave;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    @Query("select e from Leave e  where  e.description like %?1% AND e.employeeId = ?2 AND e.status != 'DELETED' ORDER BY e.id ASC")
    List<Leave> searchByEmployeeId(String description , Long employeeId, PageRequest pageRequest);
    @Query("select e from Leave e  where  e.description like %?1% AND e.companyId = ?2 AND e.status != 'DELETED' ORDER BY e.id ASC")
    List<Leave> searchByCompanyId(String description ,Long companyId, PageRequest pageRequest);

}
