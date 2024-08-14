package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.AssignLeaveRequestDto;
import com.humanresourcesapp.dto.requests.LeaveSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Leave;
import com.humanresourcesapp.entities.enums.ELeaveType;
import com.humanresourcesapp.services.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequestMapping(ROOT+LEAVE)
@RequiredArgsConstructor
@CrossOrigin("*")
public class LeaveController {
    private final LeaveService leaveService;

    @PostMapping(SEARCH_BY_EMPLOYEE_ID)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE')")
    public ResponseEntity<List<Leave>> searchByEmployeeId(@RequestBody PageRequestDto dto){
        return ResponseEntity.ok(leaveService.searchByEmployeeId(dto));
    }

    @PostMapping(SEARCH_BY_COMPANY_ID)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<Leave>> searchByCompanyId(@RequestBody PageRequestDto dto){
        return ResponseEntity.ok(leaveService.searchByCompanyId(dto));
    }

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE','MANAGER')")
    public ResponseEntity<Boolean> addLeaveRequest(@RequestParam ("description") String description,
                                                   @RequestParam ("startDate") LocalDate startDate,
                                                   @RequestParam ("endDate") LocalDate endDate,
                                                   @RequestParam ("leaveType") ELeaveType leaveType,
                                                   @Nullable @RequestParam("files") List<MultipartFile> files) {

        LeaveSaveRequestDto dto = LeaveSaveRequestDto.builder()
                .description(description)
                .startDate(startDate)
                .endDate(endDate)
                .leaveType(leaveType)
                .files(files)
                .build();
        return ResponseEntity.ok(leaveService.save(dto));
    }

    @PostMapping(ASSIGN_LEAVE)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE','MANAGER')")
    public ResponseEntity<Boolean> assignLeave(@RequestParam ("description") String description,
                                                   @RequestParam ("startDate") LocalDate startDate,
                                                   @RequestParam ("endDate") LocalDate endDate,
                                                   @RequestParam ("leaveType") ELeaveType leaveType,
                                                   @Nullable @RequestParam("files") List<MultipartFile> files,
                                                   @RequestParam ("employeeId") Long employeeId) {

        AssignLeaveRequestDto dto = AssignLeaveRequestDto.builder()
                .description(description)
                .startDate(startDate)
                .endDate(endDate)
                .leaveType(leaveType)
                .files(files)
                .employeeId(employeeId)
                .build();
        return ResponseEntity.ok(leaveService.assignLeave(dto));
    }

    @PostMapping(APPROVE_LEAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> approveLeaveRequest(Long id) {
        return ResponseEntity.ok(leaveService.approveLeaveRequest(id));
    }

    @DeleteMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE','MANAGER')")
    public ResponseEntity<Boolean> delete(Long id){
        return ResponseEntity.ok(leaveService.delete(id));
    }

    @PostMapping(CANCEL)
    @PreAuthorize("hasAnyAuthority('EMPLOYEE','MANAGER')")
    public ResponseEntity<Boolean> cancel(Long id){
        return ResponseEntity.ok(leaveService.cancel(id));
    }

    @PostMapping(CHANGE_LEAVE_DAY)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> changeLeaveDay(@RequestParam ("id") Long id,
                                               @RequestParam ("leaveDay") Integer leaveDay) {
        return ResponseEntity.ok(leaveService.changeLeaveDay(id,leaveDay));
    }
}
