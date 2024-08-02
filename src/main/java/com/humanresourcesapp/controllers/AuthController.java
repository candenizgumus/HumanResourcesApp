package com.humanresourcesapp.controllers;

import static com.humanresourcesapp.constants.Endpoints.*;

import com.humanresourcesapp.dto.requests.AuthLoginRequestDto;
import com.humanresourcesapp.dto.responses.LoginResponseDto;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    public ResponseEntity<LoginResponseDto> login(@RequestBody AuthLoginRequestDto dto)
    {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.email(), dto.password()));
        } catch (AuthenticationException e) {
            throw new HumanResourcesAppException(ErrorType.EMAIL_OR_PASSWORD_WRONG);
        }

        final Auth auth = (Auth)authService.loadUserByUsername(dto.email());
        if (auth != null) {
            String token = jwtTokenManager.createTokenFromAuth(auth).orElseThrow(() -> new HumanResourcesAppException(ErrorType.TOKEN_CREATION_FAILED));
            LoginResponseDto loginResponseDto = new LoginResponseDto(token);
            return ResponseEntity.ok(loginResponseDto);
        }
        return ResponseEntity.badRequest().build();
    }







}
