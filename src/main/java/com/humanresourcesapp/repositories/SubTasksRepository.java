package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.SubTasks;
import com.humanresourcesapp.entities.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubTasksRepository extends JpaRepository<SubTasks,Long> {


    List<SubTasks> findAllByTaskIdOrderByIdAsc(Long taskId);
}
