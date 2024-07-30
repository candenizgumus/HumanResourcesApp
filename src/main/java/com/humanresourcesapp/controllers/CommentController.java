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
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+COMMENT)
@CrossOrigin("*")
public class CommentController {
    private final CommentService commentService;
    @PostMapping(SAVE)
    public ResponseEntity<Comment> save(CommentSaveRequestDto dto) {
        return ResponseEntity.ok(commentService.save(dto));
    }

}
