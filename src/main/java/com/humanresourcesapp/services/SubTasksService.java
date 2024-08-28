package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.SubTasks;
import com.humanresourcesapp.entities.Tasks;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.SubTasksRepository;
import com.humanresourcesapp.repositories.TasksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubTasksService
{
    private final SubTasksRepository subTasksRepository;
    private TasksService tasksService;

    @Autowired
    public void setSubTasksService(@Lazy TasksService tasksService)
    {
        this.tasksService = tasksService;
    }

    public List<SubTasks> findAllByTaskId(Long taskId)
    {
        return subTasksRepository.findAllByTaskIdOrderByIdDesc(taskId);
    }

    public void deleteById(Long id)
    {

        subTasksRepository.deleteById(id);
    }

    public void finishSubtask(Long id)
    {

        SubTasks subTasks = subTasksRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.SUBTASK_NOT_FOUND));
        subTasks.getTask().setNumberOfCompletedSubtasks(subTasks.getTask().getNumberOfCompletedSubtasks() + 1);
        subTasks.setIsCompleted(true);
        subTasksRepository.save(subTasks);
    }

    public void cancelSubtask(Long id)
    {

        SubTasks subTasks = subTasksRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.SUBTASK_NOT_FOUND));
        subTasks.getTask().setNumberOfCompletedSubtasks(subTasks.getTask().getNumberOfCompletedSubtasks() - 1);
        subTasks.setIsCompleted(false);
        subTasksRepository.save(subTasks);
    }

    public void completeTask(Long id)
    {
        Tasks task = tasksService.findById(id);
        List<SubTasks> subTasksList = subTasksRepository.findAllByTaskIdOrderByIdDesc(task.getId());

        if (!subTasksList.isEmpty())
        {
            subTasksList.forEach(subTask -> subTask.setIsCompleted(true));
            task.setNumberOfCompletedSubtasks(subTasksList.size());
            task.setIsCompleted(true);
            task.setCompletetionDate(LocalDate.now());
            tasksService.update(task);
        }else
        {
            task.setIsCompleted(true);
            task.setCompletetionDate(LocalDate.now());
            tasksService.update(task);
        }


    }
}
