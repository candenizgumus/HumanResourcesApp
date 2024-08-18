package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.DefinitionSaveRequestDto;
import com.humanresourcesapp.entities.Definition;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EDefinitionType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
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

        Optional<Definition> optionalDefinition = definitionRepository.findByNameAndDefinitionType(dto.name(), dto.definitionType());
        Definition definition;

        if(optionalDefinition.isPresent()){
            definition = optionalDefinition.get();
            if(user.getUserType().equals(EUserType.ADMIN)){
                definition.setCompanyId(user.getCompanyId());
                definition.setStatus(EStatus.ACTIVE);
                definitionRepository.save(definition);
                return true;
            }else {
                if(definition.getCompanyId() == null){
                    throw new HumanResourcesAppException(ErrorType.ALREADY_DEFINED);
                }else {
                    if(!definition.getCompanyId().equals(user.getCompanyId())){
                        throw new HumanResourcesAppException(ErrorType.INSUFFICIENT_PERMISSION);
                    }else {
                        if(definition.getStatus().equals(EStatus.ACTIVE)){
                            throw new HumanResourcesAppException(ErrorType.DEFINITION_ALREADY_EXISTS);
                        } else {
                            definition.setStatus(EStatus.ACTIVE);
                            definitionRepository.save(definition);
                            return true;
                        }
                    }
                }
            }
        } else {
            definition = Definition.builder()
                    .definitionType(dto.definitionType())
                    .name(dto.name())
                    .companyId(user.getCompanyId())
                    .status(EStatus.ACTIVE)
                    .build();
            definitionRepository.save(definition);
            return true;
        }
    }

    public Definition findByName(String name) {
        return definitionRepository.findByName(name).orElseThrow(() -> new HumanResourcesAppException(ErrorType.DEFINITION_NOT_FOUND));
    }


    public List<Definition> getAllByDefinitionType(EDefinitionType definitionType) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        List<Definition> definitions;
        if(user.getCompanyId() == null){
            definitions = definitionRepository.findAllByDefinitionTypeAndStatusAndCompanyIdIsNull(definitionType, EStatus.ACTIVE);
        }else {
            definitions = definitionRepository.findAllByDefinitionTypeAndStatusAndCompanyId(definitionType, EStatus.ACTIVE, user.getCompanyId());
            definitions.addAll(definitionRepository.findAllByDefinitionTypeAndStatusAndCompanyIdIsNull(definitionType, EStatus.ACTIVE));
        }
        return definitions;
    }

    public void save(Definition definition) {
        definitionRepository.save(definition);
    }

    public Boolean delete(Long id) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        Definition definition = definitionRepository.findById(id).orElseThrow(() -> new HumanResourcesAppException(ErrorType.DEFINITION_NOT_FOUND));

        if(user.getUserType().equals(EUserType.ADMIN) && !definition.getStatus().equals(EStatus.DELETED)){
            definition.setStatus(EStatus.DELETED);
            definitionRepository.save(definition);
            return true;
        } else if(user.getCompanyId() != null && user.getCompanyId().equals(definition.getCompanyId()) && definition.getCompanyId() != null && !definition.getStatus().equals(EStatus.DELETED)){
            definition.setStatus(EStatus.DELETED);
            definitionRepository.save(definition);
            return true;
        } else {
            throw new HumanResourcesAppException(ErrorType.PREDEFINED_DEFINITION_CANNOT_BE_DELETED);
        }
    }
}
