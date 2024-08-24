package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.CommentSaveRequestDto;
import com.humanresourcesapp.dto.requests.CommentUpdateRequestDto;
import com.humanresourcesapp.dto.responses.CommentResponseDto;
import com.humanresourcesapp.entities.Comment;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.CommentRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import com.humanresourcesapp.utility.UtilMethods;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final CompanyService companyService;

    public Comment save(CommentSaveRequestDto dto) {
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        if(commentRepository.findByCompanyId(manager.getCompanyId()).isPresent()){
            throw new HumanResourcesAppException(ErrorType.COMPANY_ALREADY_COMMENTED);
        }
        return commentRepository.save(Comment.builder()
                .managerId(manager.getId())
                .shortDescription(dto.shortDescription())
                .longDescription(dto.longDescription())
                .companyId(manager.getCompanyId())
                .status(EStatus.ACTIVE)
                .build());
    }

    public List<CommentResponseDto> getAll() {
        List<Comment> commentList = commentRepository.findAllByLongDescriptionIsNotNullAndShortDescriptionIsNotNull();
        List<CommentResponseDto> commentDtoList = new ArrayList<>();
        for (Comment comment : commentList) {
            User manager = userService.findById(comment.getManagerId());
            Company company = companyService.findById(comment.getCompanyId()).orElseThrow(() -> new RuntimeException("Company not found"));
            commentDtoList.add(CommentResponseDto.builder()
                    .id(comment.getId())
                    .shortDescription(comment.getShortDescription())
                    .longDescription(comment.getLongDescription())
                    .companyName(company.getName())
                    .managerName(manager.getName()+" "+manager.getSurname())
                    .title(manager.getTitle())
                    .photo(manager.getPhoto())
                    .numberOfEmployees(company.getNumberOfEmployee())
                    .sector(manager.getSector().name())
                    .logo(company.getLogo())
                    .country(company.getCountry())
                    .build());
        }
        return commentDtoList;
    }

    public void saveAll(List<Comment> commentList) {
        commentRepository.saveAll(commentList);
    }

    public Comment update(CommentUpdateRequestDto dto) {

        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));

        if(commentRepository.findByCompanyId(manager.getCompanyId()).isEmpty()){
            throw new HumanResourcesAppException(ErrorType.COMMENT_NOT_FOUND);
        }

        Comment comment = commentRepository.findByCompanyId(manager.getCompanyId()).get();

        if(!UtilMethods.isNullOrWhitespace(dto.shortDescription())){
            comment.setShortDescription(dto.shortDescription());
        }
        if (!UtilMethods.isNullOrWhitespace(dto.longDescription())) {
            comment.setLongDescription(dto.longDescription());
        }
        if(dto.setNewManager()){
            comment.setManagerId(manager.getId());
        }
        return commentRepository.save(comment);
    }

    public Comment getCompanyComment() {
        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
        User manager = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
        Optional<Comment> byCompanyId = commentRepository.findByCompanyId(manager.getCompanyId());

        if(byCompanyId.isPresent())
            return byCompanyId.get();
        else {
            return commentRepository.save(Comment.builder().managerId(manager.getId()).companyId(manager.getCompanyId()).status(EStatus.ACTIVE).build());
        }
    }
}
