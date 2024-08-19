package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.DefinitionGetRequestDto;
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
import org.springframework.data.domain.PageRequest;
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


    // DANGER ZONE
    public Boolean save(DefinitionSaveRequestDto dto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        List<Definition> definitionList = definitionRepository.findAllByNameAndDefinitionType(dto.name(), dto.definitionType());
        Definition definition;

        // ya vardır
        if(!definitionList.isEmpty()){
            // 1 tane varsa
            if(definitionList.size() == 1){
                definition = definitionList.get(0);
                // varsa ya silinmiştir
                if (definition.getStatus().equals(EStatus.DELETED)) {
                    // silinmişse ve user kaydetmişse
                    if(definition.getCompanyId() != null){
                        // kaydetmeye çalışan user ise
                        if(user.getUserType().equals(EUserType.MANAGER)){
                            // kendi şirketinden ise
                            if (definition.getCompanyId().equals(user.getCompanyId())){
                                definition.setStatus(EStatus.ACTIVE);
                                definitionRepository.save(definition);
                                return true;
                            }
                            // kendi şirketinden değil ise
                            else {
                                // bir kopyasını bu şirket için oluştur
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
                        // kaydetmeye çalışan admin ise
                        else {
                            // predefined olarak update et
                            definition.setCompanyId(user.getCompanyId());
                            definition.setStatus(EStatus.ACTIVE);
                            definitionRepository.save(definition);
                            return true;
                        }
                    }
                    //silinmişse ve admin kaydetmiş ise
                    else {
                        definition.setCompanyId(user.getCompanyId());
                        definition.setStatus(EStatus.ACTIVE);
                        definitionRepository.save(definition);
                        return true;
                    }
                } else{ // ya silinmemiştir
                    // silinmemişse ve user kaydetmişse
                    if (definition.getCompanyId() != null){
                        // kaydetmeyi deneyen admin ise
                        if(user.getUserType().equals(EUserType.ADMIN)){
                            // predefined olarak update et
                            definition.setCompanyId(user.getCompanyId());
                            definition.setStatus(EStatus.ACTIVE);
                            definitionRepository.save(definition);
                            return true;
                        }
                        // kaydetmeyi deneyen user ise
                        else {
                            // kendi şirketi daha önce kaydetmiş ise
                            if(definition.getCompanyId().equals(user.getCompanyId())){
                                throw new HumanResourcesAppException(ErrorType.DEFINITION_ALREADY_EXISTS);
                            }
                            // kendi şirketi daha önce kaydetmemişse
                            else {
                                // bir kopyasını bu şirket için oluştur
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
                    }
                    //silinmemişse ve admin kaydetmişse
                    else {
                        // kaydetmeye çalışan user ise
                        if(user.getUserType().equals(EUserType.MANAGER)){
                            throw new HumanResourcesAppException(ErrorType.ALREADY_DEFINED);
                        }
                        // kaydetmeye çalışan admin ise
                        else {
                            throw new HumanResourcesAppException(ErrorType.DEFINITION_ALREADY_EXISTS);
                        }
                    }
                }
            }
            // birden fazla varsa
            else {
                // kaydetmeye çalışan user ise
                if(user.getUserType().equals(EUserType.MANAGER)){
                    // kendi şirketinden olanı bul
                    definition = definitionList.stream().filter(d -> d.getCompanyId().equals(user.getCompanyId())).findFirst().orElse(null);
                    // varsa ve silinmişse
                    if(definition != null && definition.getStatus().equals(EStatus.DELETED)){
                        definition.setStatus(EStatus.ACTIVE);
                        definitionRepository.save(definition);
                        return true;
                    }
                    //varsa ve silinmemişse
                    else if (definition != null && definition.getStatus().equals(EStatus.ACTIVE)){
                        throw new HumanResourcesAppException(ErrorType.DEFINITION_ALREADY_EXISTS);
                    }else {
                        // yoksa kaydet ve true döndür
                        definition = Definition.builder()
                                .definitionType(dto.definitionType())
                                .name(dto.name())
                                .companyId(user.getCompanyId())
                                .status(EStatus.ACTIVE)
                                .build();
                        definitionRepository.save(definition);
                        return true;
                    }
                }// kaydetmeye çalışan admin ise
                else {
                    definitionRepository.deleteAll(definitionList);
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

        }else { // ya yoktur
            // yoksa kaydet ve true döndür
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
            definitions = definitionRepository.findAllByDefinitionTypeAndStatusAndCompanyIdIsNullOrderByNameAsc(definitionType, EStatus.ACTIVE);
        }else {
            definitions = definitionRepository.findAllByDefinitionTypeAndStatusAndCompanyIdOrderByNameAsc(definitionType, EStatus.ACTIVE, user.getCompanyId());
            definitions.addAll(definitionRepository.findAllByDefinitionTypeAndStatusAndCompanyIdIsNullOrderByNameAsc(definitionType, EStatus.ACTIVE));
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

    public List<Definition> getAllByDefinitionTypeWithPage(DefinitionGetRequestDto dto) {
        String userEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User user = userService.findByEmail(userEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        List<Definition> definitions;
        if(user.getCompanyId() == null){
            definitions = definitionRepository.findAllByDefinitionTypeAndStatusAndCompanyIdIsNullAndNameContainingIgnoreCaseOrderByNameAsc(dto.definitionType(), EStatus.ACTIVE, dto.searchText(), PageRequest.of(dto.page(), dto.pageSize()));
        }else {
            definitions = definitionRepository.findAllByDefinitionTypeAndStatusAndCompanyIdAndNameContainingIgnoreCaseOrderByNameAsc(dto.definitionType(), EStatus.ACTIVE, user.getCompanyId(),dto.searchText(),PageRequest.of(dto.page(), dto.pageSize()));
            definitions.addAll(definitionRepository.findAllByDefinitionTypeAndStatusAndCompanyIdIsNullAndNameContainingIgnoreCaseOrderByNameAsc(dto.definitionType(), EStatus.ACTIVE,dto.searchText(),PageRequest.of(dto.page(), dto.pageSize())));
        }
        return definitions;
    }
}
