package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.DefinitionSaveRequestDto;
import com.humanresourcesapp.entities.Definition;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EDefinitionType;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.DefinitionRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class DefinitionService {
    private final DefinitionRepository definitionRepository;

    private UserService userService;
    //To break circular reference in UserService
    @Autowired
    public void setUserService(@Lazy UserService userService) {
        this.userService = userService;
    }

    public Definition findById(Long id) {
        return definitionRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.DEFINITION_NOT_FOUND));
    }

    public Boolean save(DefinitionSaveRequestDto dto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        Optional<Definition> optionalDefinition = definitionRepository.findByName(dto.name());
        Definition definition;

        if(optionalDefinition.isPresent() && user.getCompanyId() != null){
            throw new HumanResourcesAppException(ErrorType.DEFINITION_ALREADY_EXISTS);
        }else if (optionalDefinition.isPresent() && user.getCompanyId() == null){
            definition = optionalDefinition.get();
            definition.setCompanyId(user.getCompanyId());
        } else {
            definition = Definition.builder()
                    .definitionType(dto.definitionType())
                    .name(dto.name())
                    .companyId(user.getCompanyId())
                    .build();
        }
        definitionRepository.save(definition);
        return true;
    }

    public Definition findByName(String name) {
        return definitionRepository.findByName(name).orElseThrow(() -> new HumanResourcesAppException(ErrorType.DEFINITION_NOT_FOUND));
    }


    public List<Definition> getAllByDefinitionType(EDefinitionType definitionType) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        List<Definition> definitions;
        if(user.getCompanyId() == null){
            definitions = definitionRepository.findAllByDefinitionTypeAndCompanyIdIsNull(definitionType);
        }else {
            definitions = definitionRepository.findAllByDefinitionTypeAndCompanyId(definitionType, user.getCompanyId());
            definitions.addAll(definitionRepository.findAllByDefinitionTypeAndCompanyIdIsNull(definitionType));
        }
        return definitions;
    }

    public void save(Definition definition) {
        definitionRepository.save(definition);
    }
}
