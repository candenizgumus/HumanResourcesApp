package com.humanresourcesapp.controllers;

import static com.humanresourcesapp.constants.Endpoints.*;

import com.humanresourcesapp.dto.requests.AuthLoginRequestDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+AUTH)
@CrossOrigin("*")
public class AuthController
{
    private final AuthService authService;


    @PostMapping(LOGIN)
    public ResponseEntity<String> login(@RequestBody AuthLoginRequestDto dto)
    {
        return ResponseEntity.ok(authService.login(dto));
    }


}
