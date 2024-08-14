package com.humanresourcesapp.services;

import com.humanresourcesapp.configs.aws.S3Buckets;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.PersonalDocumentSaveRequestDto;
import com.humanresourcesapp.dto.responses.PersonalDocumentResponseDto;
import com.humanresourcesapp.entities.PersonalDocument;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EDocumentType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.PersonalDocumentRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonalDocumentService {
    private final PersonalDocumentRepository personalDocumentRepository;
    private final UserService userService;
    private final S3Buckets s3Buckets;
    private final S3Service s3Service;


    public PersonalDocument save(String employeeId, String documentType, List<MultipartFile> documentFile, String description) {
        User employee = userService.findById(Long.valueOf(employeeId));
        // Saving file
        String fileName = "";

        if (documentFile != null && !documentFile.isEmpty()) {
            for (MultipartFile file : documentFile) {
                fileName = employee.getEmail() + "/" + file.getOriginalFilename();
                byte[] fileContent;
                String key;
                try {
                    fileContent = file.getBytes();
                    key = "personelDocuments/%s".formatted(fileName);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read file content", e);
                }
                s3Service.putObject(s3Buckets.getCustomer(),
                        key,
                        fileContent);
            }
        }

        return personalDocumentRepository.save(PersonalDocument.builder()
                .documentType(EDocumentType.valueOf(documentType))
                .employeeId(Long.valueOf(employeeId))
                .attachedFile(fileName)
                .description(description)
                .email(employee.getEmail())
                .companyId(employee.getCompanyId())
                .status(EStatus.ACTIVE)
                .build());
    }

    public PersonalDocument delete(Long personalDocumentId) {
        Optional<PersonalDocument> optionalPersonalDocument = personalDocumentRepository.findById(personalDocumentId);
        if (optionalPersonalDocument.isPresent()) {
            personalDocumentRepository.delete(optionalPersonalDocument.get());
            return optionalPersonalDocument.get();
        } else {
            throw new HumanResourcesAppException(ErrorType.ID_NOT_FOUND);
        }
    }

//    public PersonalDocument update(Long personalDocumentId, PersonalDocumentSaveRequestDto personalDocumentSaveRequestDto) {
//        Optional<PersonalDocument> optionalPersonalDocument = personalDocumentRepository.findById(personalDocumentId);
//        if (optionalPersonalDocument.isPresent()) {
//            PersonalDocument personalDocument = optionalPersonalDocument.get();
//            personalDocument.setDocumentType(personalDocumentSaveRequestDto.documentType());
//            personalDocument.setEmployeeId(personalDocumentSaveRequestDto.employeeId());
//            personalDocument.setAttachedFile(personalDocumentSaveRequestDto.documentFile());
//            return personalDocumentRepository.save(personalDocument);
//        } else {
//            throw new HumanResourcesAppException(ErrorType.ID_NOT_FOUND);
//        }
//    }

    public List<PersonalDocument> getAll() {
        return personalDocumentRepository.findAll();
    }

    public List<PersonalDocument> getAllByEmail(PageRequestDto dto) {
        String employeeEmail = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User employee = userService.findByEmail(employeeEmail).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        return personalDocumentRepository.findByEmailContainingAndCompanyIdAndStatus(dto.searchText(), employee.getCompanyId(), EStatus.ACTIVE, PageRequest.of(dto.page(), dto.pageSize()));

    }

    public List<PersonalDocument> getByEmployeeId(Long employeeId) {
        return personalDocumentRepository.findByEmployeeId(employeeId);
    }
}
