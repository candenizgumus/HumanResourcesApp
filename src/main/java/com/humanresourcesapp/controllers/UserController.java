package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.AddEmployeeToManagerRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<List<User>> getAll(@RequestBody PageRequestDto dto)
    {
        return ResponseEntity.ok(userService.getAll(dto));
    }

    //TODO BURAYI YAP
    @GetMapping(GET_ALL_USERS_OF_MANAGER_BY_COMPANY_ID)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<User>> getAllUsersOfManagerByCompanyId()
    {
        return ResponseEntity.ok(userService.getAllUsersOfManagerByCompanyId());
    }

    @GetMapping(FIND_BY_ID)
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN')")
    public ResponseEntity<User> findById(Long id){

        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping(ADD_EMPLOYEE_TO_MANAGER)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<User> addEmployeeToManager(@RequestBody AddEmployeeToManagerRequestDto dto)
    {
        return ResponseEntity.ok(userService.addEmployeeToManager(dto));
    }

    @GetMapping(FIND_BY_TOKEN)
    @CrossOrigin("*")
    public ResponseEntity<User> findUserByToken(String token){
        return ResponseEntity.ok(userService.findByToken(token));
    }
}
