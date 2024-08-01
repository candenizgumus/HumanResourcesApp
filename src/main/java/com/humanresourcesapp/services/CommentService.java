package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.CommentSaveRequestDto;
import com.humanresourcesapp.dto.responses.CommentResponseDto;
import com.humanresourcesapp.entities.Comment;
import com.humanresourcesapp.repositories.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

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
            commentDtoList.add(new CommentResponseDto(comment.getCommentText(), comment.getPhoto()));
        }
        return commentDtoList;
    }
}
