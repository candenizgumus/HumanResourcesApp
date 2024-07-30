package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.LeaveRequest;
import com.humanresourcesapp.services.LeaveRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequestMapping(ROOT+LEAVE_REQUEST)
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @GetMapping(GET_ALL)
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestService.findAll();
    }

    @PostMapping(SAVE)
    public LeaveRequest addLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        return leaveRequestService.save(leaveRequest);
    }
}
