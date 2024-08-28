package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.AssignTaskToEmployeeRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.SubTasksSaveRequestDto;
import com.humanresourcesapp.dto.requests.TasksSaveRequestDto;
import com.humanresourcesapp.dto.responses.TaskResponseDto;
import com.humanresourcesapp.entities.SubTasks;
import com.humanresourcesapp.entities.Tasks;
import com.humanresourcesapp.services.TasksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT+TASKS)
@RequiredArgsConstructor
@CrossOrigin("*")
public class TasksController
{
    private final TasksService tasksService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> save(@RequestBody TasksSaveRequestDto dto){
        return ResponseEntity.ok(tasksService.save(dto));
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<TaskResponseDto>> getAll(@RequestBody PageRequestDto dto){
        return ResponseEntity.ok(tasksService.getAll(dto));
    }

    @PostMapping(ASSIGN_TASK_TO_EMPLOYEE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> assignTaskToEmployee(@RequestBody AssignTaskToEmployeeRequestDto dto){
        return ResponseEntity.ok(tasksService.assignTaskToEmployee(dto));
    }

    @PostMapping(SAVE_SUBTASK)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> saveSubtask(@RequestBody SubTasksSaveRequestDto dto){
        return ResponseEntity.ok(tasksService.saveSubtask(dto));
    }

    @DeleteMapping(DELETE_SUBTASK)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> deleteSubtask(Long id){
        return ResponseEntity.ok(tasksService.deleteSubtask(id));
    }

    @PostMapping(GET_ALL_SUBTASKS_OF_SELECTED_TASK)
    @PreAuthorize("hasAnyAuthority('MANAGER','EMPLOYEE')")
    public ResponseEntity<List<SubTasks>> getAllSubtasksOfSelectedTask(Long taskId){
        return ResponseEntity.ok(tasksService.getAllSubtasksOfSelectedTask(taskId));
    }

    @PostMapping(GET_TASKS_OF_EMPLOYEE)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<List<TaskResponseDto>> getTasksOfEmployee(@RequestBody PageRequestDto dto){
        return ResponseEntity.ok(tasksService.getTasksOfEmployee(dto));
    }

    @DeleteMapping(FINISH_SUBTASK)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<Boolean> finishSubtask(Long id){
        return ResponseEntity.ok(tasksService.finishSubtask(id));
    }

    @DeleteMapping(CANCEL_SUBTASK)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<Boolean> cancelSubTask(Long id){
        return ResponseEntity.ok(tasksService.cancelSubTask(id));
    }

    @PostMapping(COMPLETE_TASK)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<Boolean> completeTask(Long id){
        return ResponseEntity.ok(tasksService.completeTask(id));
    }

    @DeleteMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> delete(Long id){
        return ResponseEntity.ok(tasksService.delete(id));
    }

}
