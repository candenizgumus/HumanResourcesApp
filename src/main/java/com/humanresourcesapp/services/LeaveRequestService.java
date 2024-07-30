package com.humanresourcesapp.services;

import com.humanresourcesapp.entities.LeaveRequest;
import com.humanresourcesapp.repositories.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public LeaveRequest save(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> findAll() {
        return leaveRequestRepository.findAll();
    }
}




