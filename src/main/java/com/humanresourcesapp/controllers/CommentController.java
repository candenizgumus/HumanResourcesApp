package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.CommentSaveRequestDto;
import com.humanresourcesapp.entities.Comment;
import com.humanresourcesapp.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
@CrossOrigin("*")
public class CommentController {
    private final CommentService commentService;
    @PostMapping("/save")
    public ResponseEntity<Comment> save(CommentSaveRequestDto dto) {
        return ResponseEntity.ok(commentService.save(dto));
    }

}
