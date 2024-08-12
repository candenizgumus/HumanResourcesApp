package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.LeaveSaveRequestDto;
import com.humanresourcesapp.dto.responses.LeaveResponseDto;
import com.humanresourcesapp.entities.Leave;
import com.humanresourcesapp.entities.LeaveRequest;
import com.humanresourcesapp.services.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import static com.humanresourcesapp.constants.Endpoints.*;
//@RestController
//@RequestMapping(ROOT+LEAVE)
//@RequiredArgsConstructor
//@CrossOrigin("*")
//public class LeaveController {
////    private final LeaveService leaveService;
////
////    @GetMapping(GET_ALL)
////    public ResponseEntity<List<LeaveResponseDto>> getAllLeaveRequests() {
////        return ResponseEntity.ok(leaveService.findAll());
////    }
////
////    @PostMapping(SAVE)
////    public ResponseEntity<Boolean> addLeaveRequest(@RequestBody LeaveSaveRequestDto dto) {
////        return ResponseEntity.ok(leaveService.save(dto));
////    }
//}
