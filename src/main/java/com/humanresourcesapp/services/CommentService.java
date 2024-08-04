package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.CommentSaveRequestDto;
import com.humanresourcesapp.dto.responses.CommentResponseDto;
import com.humanresourcesapp.entities.Comment;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.repositories.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final CompanyService companyService;

    public Comment save(CommentSaveRequestDto dto) {
        return commentRepository.save(Comment.builder()
                .commentText(dto.commentText())
                .companyId(dto.companyId())
                        .photo(dto.photo())
                .build());
    }

    public List<CommentResponseDto> getAll() {
        List<Comment> commentList = commentRepository.findAll();
        List<CommentResponseDto> commentDtoList = new ArrayList<>();
        for (Comment comment : commentList) {
            User manager = userService.findById(comment.getManagerId());
            Company company = companyService.findById(comment.getCompanyId()).orElseThrow(() -> new RuntimeException("Company not found"));
            commentDtoList.add(CommentResponseDto.builder()
                    .id(comment.getId())
                    .commentText(comment.getCommentText())
                    .companyName(company.getName())
                    .managerName(manager.getName())
                    .title(manager.getTitle())
                    .photo(comment.getPhoto())
                    .build());
        }
        return commentDtoList;
    }

    public void saveAll(List<Comment> commentList) {
        commentRepository.saveAll(commentList);
    }
}
