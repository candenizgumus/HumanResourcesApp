package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.LeaveRequest;
import com.humanresourcesapp.services.LeaveRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaveRequests")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestService.findAll();
    }

    @PostMapping
    public LeaveRequest addLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        return leaveRequestService.save(leaveRequest);
    }
}
