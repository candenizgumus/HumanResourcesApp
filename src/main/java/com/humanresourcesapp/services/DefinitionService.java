package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.DefinitionSaveRequestDto;
import com.humanresourcesapp.entities.definitions.DLeaveType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.DLeaveTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DefinitionService {
    private final DLeaveTypeRepository dLeaveTypeRepository;

    public List<DLeaveType> getAll() {
        return dLeaveTypeRepository.findAll();
    }

    public DLeaveType findById(Long id) {
        return dLeaveTypeRepository.findById(id).orElse(null);
    }

    public Boolean save(DefinitionSaveRequestDto dto) {
        if(dto.definitionType().equals("LEAVE_TYPE")) {
            DLeaveType dLeaveType = DLeaveType.builder()
                    .name(dto.name())
                    .build();
            dLeaveTypeRepository.save(dLeaveType);
            return true;
        }
        return false;
    }

    public DLeaveType findByName(String name) {
        return dLeaveTypeRepository.findByName(name).orElseThrow(() -> new HumanResourcesAppException(ErrorType.LEAVE_TYPE_NOT_FOUND));
    }

    public Boolean saveLeaveType(DLeaveType dLeaveType) {
        dLeaveTypeRepository.save(dLeaveType);
        return true;
    }
}
