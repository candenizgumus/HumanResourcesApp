package com.humanresourcesapp.controllers;

import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController
{
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Boolean> register(Auth auth)
    {
        return ResponseEntity.ok(authService.login(auth));
    }
}
