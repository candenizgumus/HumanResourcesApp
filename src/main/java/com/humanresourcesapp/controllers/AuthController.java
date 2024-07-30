package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.AuthRegisterRequestDto;
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

   /* @PostMapping("/send-offer")
    public ResponseEntity<Boolean> register(AuthRegisterRequestDto dto)
    {
        return ResponseEntity.ok(authService.register(dto));
    }*/

    @PostMapping("/login")
    public ResponseEntity<String> login(Auth auth)
    {
        return ResponseEntity.ok(authService.login(auth));
    }
}
