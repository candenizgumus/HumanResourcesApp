package com.humanresourcesapp.controllers;

import static com.humanresourcesapp.constants.Endpoints.*;

import com.humanresourcesapp.dto.requests.AuthLoginRequestDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.services.AuthService;
import com.humanresourcesapp.utility.JwtTokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+AUTH)
@CrossOrigin("*")
public class AuthController
{
    private final AuthService authService;
    private final JwtTokenManager jwtTokenManager;
    private final AuthenticationManager authenticationManager;


    @PostMapping(LOGIN)
    public ResponseEntity<String> login(@RequestBody AuthLoginRequestDto dto)
    {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.email(), dto.password()));
        } catch (AuthenticationException e) {
            throw new HumanResourcesAppException(ErrorType.EMAIL_OR_PASSWORD_WRONG);
        }

        final Auth auth = (Auth)authService.loadUserByUsername(dto.email());
        if (auth != null) {
            return ResponseEntity.ok(jwtTokenManager.createTokenFromAuth(auth).orElseThrow(() -> new HumanResourcesAppException(ErrorType.TOKEN_CREATION_FAILED)));
        }
        return ResponseEntity.badRequest().build();
    }




}
