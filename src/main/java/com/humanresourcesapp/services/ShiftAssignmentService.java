package com.humanresourcesapp.services;
import com.humanresourcesapp.entities.ShiftAssignment;
import com.humanresourcesapp.repositories.ShiftAssignmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ShiftAssignmentService {

    private final ShiftAssignmentRepository shiftAssignmentRepository;

    public ShiftAssignmentService(ShiftAssignmentRepository shiftAssignmentRepository) {
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    public ShiftAssignment save(ShiftAssignment shiftAssignment) {
        return shiftAssignmentRepository.save(shiftAssignment);
    }

    public List<ShiftAssignment> findAll() {
        return shiftAssignmentRepository.findAll();
    }
}

