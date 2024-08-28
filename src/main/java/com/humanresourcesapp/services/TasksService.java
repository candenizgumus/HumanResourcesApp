package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.AssignTaskToEmployeeRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.SubTasksSaveRequestDto;
import com.humanresourcesapp.dto.requests.TasksSaveRequestDto;
import com.humanresourcesapp.entities.SubTasks;
import com.humanresourcesapp.entities.Tasks;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.SubTasksRepository;
import com.humanresourcesapp.repositories.TasksRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TasksService
{
    private final TasksRepository tasksRepository;
    private final UserService userService;
    private final SubTasksService subTasksService;

    public Boolean save(TasksSaveRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        tasksRepository.save(Tasks
                .builder()
                        .managerId(manager.getId())
                        .companyId(manager.getCompanyId())
                        .isCompleted(false)
                        .numberOfCompletedSubtasks(0)
                        .taskName(dto.taskName())
                        .status(EStatus.ACTIVE)
                .build());
        return true;
    }

    public List<Tasks> getAll(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return tasksRepository.findByTaskNameContainingAndCompanyIdAndStatus(dto.searchText(), manager.getCompanyId(), EStatus.ACTIVE, PageRequest.of(dto.page(), dto.pageSize()));
    }

    public Boolean assignTaskToEmployee(AssignTaskToEmployeeRequestDto dto)
    {
        Tasks tasks = tasksRepository.findById(dto.taskId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.TASK_NOT_FOUND));
        tasks.setEmployeeId(dto.employeeId());
        tasks.setAssignedDate(LocalDate.now());

        tasksRepository.save(tasks);
        return true;
    }

    public List<SubTasks> getAllSubtasksOfSelectedTask(Long taskId)
    {
        return subTasksService.findAllByTaskId(taskId);
    }

    public Boolean saveSubtask(SubTasksSaveRequestDto dto)
    {
        Tasks task = tasksRepository.findById(dto.taskId()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.TASK_NOT_FOUND));

        SubTasks subTask = SubTasks
                .builder()
                .task(task)
                .name(dto.subTaskName())
                .isCompleted(false)
                .build();

        List<SubTasks> subtasks = task.getSubtasks();
        subtasks.add(subTask);
        task.setSubtasks(subtasks);

        tasksRepository.save(task);
        return true;
    }
}
