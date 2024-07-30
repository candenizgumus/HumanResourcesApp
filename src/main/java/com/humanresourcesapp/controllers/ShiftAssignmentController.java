package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.ShiftAssignment;
import com.humanresourcesapp.services.ShiftAssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequestMapping(ROOT+SHIFT_ASSIGNMENT)
public class ShiftAssignmentController {

    private final ShiftAssignmentService shiftAssignmentService;

    public ShiftAssignmentController(ShiftAssignmentService shiftAssignmentService) {
        this.shiftAssignmentService = shiftAssignmentService;
    }

    @GetMapping(GET_ALL)
    public List<ShiftAssignment> getAllShiftAssignments() {
        return shiftAssignmentService.findAll();
    }

    @PostMapping(SAVE)
    public ShiftAssignment addShiftAssignment(@RequestBody ShiftAssignment shiftAssignment) {
        return shiftAssignmentService.save(shiftAssignment);
    }
}
