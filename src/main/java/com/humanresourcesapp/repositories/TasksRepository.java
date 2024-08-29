package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.SubTasks;
import com.humanresourcesapp.entities.Tasks;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TasksRepository extends JpaRepository<Tasks,Long> {


    List<Tasks> findByTaskNameContainingAndCompanyIdAndStatusOrderByTaskNameDesc(String s, Long companyId, EStatus eStatus, PageRequest of);


    List<Tasks> findAllByTaskNameContainingAndEmployeeIdOrderByIdDesc(String taskName , Long id, PageRequest pageRequest);

    List<Tasks> findAllByTaskName(String s);
}
