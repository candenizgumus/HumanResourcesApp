package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.CommentSaveRequestDto;
import com.humanresourcesapp.entities.Comment;
import com.humanresourcesapp.repositories.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    public Comment save(CommentSaveRequestDto dto) {
        return commentRepository.save(Comment.builder().commentText(dto.commentText()).companyId(dto.companyId()).build());
    }
}
