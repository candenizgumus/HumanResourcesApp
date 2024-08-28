package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.SubTasks;
import com.humanresourcesapp.repositories.SubTasksRepository;
import com.humanresourcesapp.repositories.TasksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubTasksService
{
    private final SubTasksRepository subTasksRepository;

    public List<SubTasks> findAllByTaskId(Long taskId)
    {
        return subTasksRepository.findAllByTaskId(taskId);
    }
}
