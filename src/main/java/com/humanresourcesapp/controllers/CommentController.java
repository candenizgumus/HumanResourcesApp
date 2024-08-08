package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.CommentSaveRequestDto;
import com.humanresourcesapp.dto.requests.CommentUpdateRequestDto;
import com.humanresourcesapp.dto.responses.CommentResponseDto;
import com.humanresourcesapp.entities.Comment;
import com.humanresourcesapp.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+COMMENT)
@CrossOrigin("*")
public class CommentController {
    private final CommentService commentService;
    @PostMapping(SAVE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN','MANAGER')")
    public ResponseEntity<Comment> save(CommentSaveRequestDto dto) {
        return ResponseEntity.ok(commentService.save(dto));
    }

    @GetMapping(GET_ALL)
    @CrossOrigin("*")
    public ResponseEntity<List<CommentResponseDto>> getAll() {
        return ResponseEntity.ok(commentService.getAll());
    }

    @PostMapping(GET_COMPANY_COMMENT)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN')")
    public ResponseEntity<Comment> getCompanyComment() {
        return ResponseEntity.ok(commentService.getCompanyComment());
    }

    @PostMapping(UPDATE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN')")
    public ResponseEntity<Comment> update(@RequestBody CommentUpdateRequestDto dto) {
        return ResponseEntity.ok(commentService.update(dto));
    }

}
