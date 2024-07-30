package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.ShiftAssignment;
import com.humanresourcesapp.services.ShiftAssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shiftAssignments")
public class ShiftAssignmentController {

    private final ShiftAssignmentService shiftAssignmentService;

    public ShiftAssignmentController(ShiftAssignmentService shiftAssignmentService) {
        this.shiftAssignmentService = shiftAssignmentService;
    }

    @GetMapping
    public List<ShiftAssignment> getAllShiftAssignments() {
        return shiftAssignmentService.findAll();
    }

    @PostMapping
    public ShiftAssignment addShiftAssignment(@RequestBody ShiftAssignment shiftAssignment) {
        return shiftAssignmentService.save(shiftAssignment);
    }
}
