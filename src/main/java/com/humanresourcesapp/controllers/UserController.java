package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.humanresourcesapp.constants.Endpoints.*;
@RequestMapping(ROOT+USER)
@RequiredArgsConstructor
@RestController
public class UserController
{
    private final UserService userService;

    @PostMapping(SAVE)
    public ResponseEntity<User> save(User user)
    {
        return ResponseEntity.ok(userService.save(user));
    }
}
