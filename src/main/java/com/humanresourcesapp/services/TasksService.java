package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.AssignTaskToEmployeeRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.SubTasksSaveRequestDto;
import com.humanresourcesapp.dto.requests.TasksSaveRequestDto;
import com.humanresourcesapp.dto.responses.TaskResponseDto;
import com.humanresourcesapp.entities.SubTasks;
import com.humanresourcesapp.entities.Tasks;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.TasksRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
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

    public List<TaskResponseDto> getAll(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        List<Tasks> taskList = tasksRepository.findByTaskNameContainingAndCompanyIdAndStatusOrderByIdDesc(dto.searchText(), manager.getCompanyId(), EStatus.ACTIVE, PageRequest.of(dto.page(), dto.pageSize()));
        List<TaskResponseDto> taskResponseDtoList = new ArrayList<>();
        taskList.forEach(task -> {
            if (task.getAssignedDate() != null)
            {
                User user = userService.findById(task.getEmployeeId());
                taskResponseDtoList.add(new TaskResponseDto(task.getId(),task.getTaskName(), user.getName() + " " + user.getSurname(), task.getAssignedDate(), task.getCompletetionDate(), task.getNumberOfCompletedSubtasks(), task.getSubtasks().size(), task.getStatus()));
            }else
            {
                taskResponseDtoList.add(new TaskResponseDto(task.getId(),task.getTaskName(), null, task.getAssignedDate(), task.getCompletetionDate(), task.getNumberOfCompletedSubtasks(), task.getSubtasks().size(), task.getStatus()));
            }


        });
        return taskResponseDtoList;
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

    public Boolean deleteSubtask(Long id)
    {

        subTasksService.deleteById(id);
        return true;
    }

    public List<TaskResponseDto> getTasksOfEmployee(PageRequestDto dto)
    {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        List<Tasks> taskList = tasksRepository.findAllByTaskNameContainingAndEmployeeIdOrderByIdDesc(dto.searchText(),(employee.getId()), PageRequest.of(dto.page(), dto.pageSize()));
        List<TaskResponseDto> taskResponseDtoList = new ArrayList<>();
        taskList.forEach(task -> {
            if (task.getAssignedDate() != null)
            {
                User user = userService.findById(task.getEmployeeId());
                taskResponseDtoList.add(new TaskResponseDto(task.getId(),task.getTaskName(), user.getName() + " " + user.getSurname(), task.getAssignedDate(), task.getCompletetionDate(), task.getNumberOfCompletedSubtasks(), task.getSubtasks().size(), task.getStatus()));
            }else
            {
                taskResponseDtoList.add(new TaskResponseDto(task.getId(),task.getTaskName(), null, task.getAssignedDate(), task.getCompletetionDate(), task.getNumberOfCompletedSubtasks(), task.getSubtasks().size(), task.getStatus()));
            }


        });
        return taskResponseDtoList ;
    }

    public Boolean finishSubtask(Long id)
    {
        subTasksService.finishSubtask(id);
        return true;
    }

    public Boolean cancelSubTask(Long id)
    {
        subTasksService.cancelSubtask(id);
        return true;
    }

    public Boolean completeTask(Long id)
    {
        subTasksService.completeTask(id);
        return true;
    }

    public Tasks findById(Long id)
    {
        return tasksRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.TASK_NOT_FOUND));
    }

    public void update(Tasks task)
    {
        tasksRepository.save(task);
    }

    public Boolean delete(Long id)
    {
        tasksRepository.deleteById(id);
        return true;
    }
}
