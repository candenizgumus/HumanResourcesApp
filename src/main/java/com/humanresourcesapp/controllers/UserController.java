package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.*;
import com.humanresourcesapp.dto.responses.CompanyAndManagerNameResponseDto;
import com.humanresourcesapp.dto.responses.CountUserByTypeAndStatusDto;
import com.humanresourcesapp.dto.responses.MonthlySalaryOfEmployeesDto;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EEmployeeType;
import com.humanresourcesapp.entities.enums.EPosition;
import com.humanresourcesapp.entities.enums.ESectors;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;
@RequestMapping(ROOT+USER)
@RequiredArgsConstructor
@RestController
public class UserController
{
    private final UserService userService;

    @PostMapping(SAVE)
    @CrossOrigin("*")
    public ResponseEntity<User> save(User user)
    {
        return ResponseEntity.ok(userService.save(user));
    }

    @PutMapping(UPDATE)
    @CrossOrigin("*")
    public ResponseEntity<User> update(@RequestBody UpdateUserRequestDto dto)
    {
        return ResponseEntity.ok(userService.update(dto));
    }

    @PutMapping(UPDATE_EMPLOYEE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<User> updateEmployee(@RequestBody UpdateEmployeeByManagerDto dto)
    {
        return ResponseEntity.ok(userService.updateEmployee(dto));
    }


    @PutMapping(UPDATE_USER_BY_ADMIN)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Boolean> updateUserByAdmin(@RequestBody UpdateUserByAdminRequestDto dto)
    {
        return ResponseEntity.ok(userService.updateUserByAdmin(dto));
    }

    @PostMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN', 'EMPLOYEE')")
    @CrossOrigin("*")
    public void uploadPlayerProfileImage(@RequestParam("file") MultipartFile file, Authentication authentication){
        System.out.println("File name: " + file.getOriginalFilename());
        System.out.println("File size: " + file.getSize() + " bytes");
        System.out.println("File type: " + file.getContentType());
        System.out.println(authentication.getName());
        userService.uploadPlayerProfileImage(file, authentication);
    }

    @GetMapping(GET_POSITIONS)
    @CrossOrigin("*")
    public ResponseEntity<EPosition[]> getPositions()
    {
        return ResponseEntity.ok(EPosition.values());
    }

    @GetMapping(GET_SECTORS)
    @CrossOrigin("*")
    public ResponseEntity<ESectors[]> getSectors()
    {
        return ResponseEntity.ok(ESectors.values());
    }
    @GetMapping(GET_EMPLOYEE_TYPES)
    @CrossOrigin("*")
    public ResponseEntity<EEmployeeType[]> getEmployeeTypes()
    {
        return ResponseEntity.ok(EEmployeeType.values());
    }

    @GetMapping(GET_STATUS)
    @CrossOrigin("*")
    public ResponseEntity<EStatus[]> getStatus()
    {
        return ResponseEntity.ok(EStatus.values());
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @CrossOrigin("*")
    public ResponseEntity<List<User>> getAll(@RequestBody PageRequestDto dto)
    {
        return ResponseEntity.ok(userService.getAll(dto));
    }

    

    @PostMapping(GET_ALL_USERS_OF_MANAGER_BY_COMPANY_ID)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    @CrossOrigin("*")
    public ResponseEntity<List<User>> getAllUsersOfManagerByCompanyId(@RequestBody PageRequestDto dto)
    {
        return ResponseEntity.ok(userService.getAllUsersOfManagerByCompanyId(dto));
    }

    @PostMapping(FIND_BY_ID)
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN')")
    @CrossOrigin("*")
    public ResponseEntity<User> findById(Long id){

        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping(ADD_EMPLOYEE_TO_MANAGER)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    @CrossOrigin("*")
    public ResponseEntity<User> addEmployeeToManager(@RequestBody AddEmployeeToManagerRequestDto dto)
    {
        return ResponseEntity.ok(userService.addEmployeeToManager(dto));
    }

    @GetMapping(FIND_BY_TOKEN)
    @CrossOrigin("*")
    public ResponseEntity<User> findUserByToken(String token){
        return ResponseEntity.ok(userService.findByToken(token));
    }

    @PostMapping(FIND_COMPANY_NAME_AND_MANAGER_NAME_OF_USER)
    @CrossOrigin("*")
    public ResponseEntity<CompanyAndManagerNameResponseDto> findCompanyNameAndManagerNameOfUser(){
        return ResponseEntity.ok(userService.findCompanyNameAndManagerNameOfUser());
    }

    @PostMapping(GET_COUNT)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN','MANAGER')")
    public ResponseEntity<Long> getCount(@RequestBody PageCountRequestDto dto)
    {
        return ResponseEntity.ok(userService.getCount(dto));
    }

    @PostMapping(COUNT_BY_MONTH)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<List<Long>> getCountByMonth()
    {

        return ResponseEntity.ok(userService.getCountByMonth());
    }

    @DeleteMapping(DELETE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> delete(Long id)
    {
        return ResponseEntity.ok(userService.delete(id));
    }

    @PutMapping(ACTIVATE_EMPLOYEE)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Boolean> activateEmployee(Long id)
    {
        return ResponseEntity.ok(userService.activateEmployee(id));
    }

    @PostMapping(SAVE_ADMIN)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Auth> save(@RequestBody Auth auth)
    {
        return ResponseEntity.ok(userService.saveAdmin(auth));
    }

    @PostMapping(COUNT_OF_CUSTOMERS_FOR_GRAPH)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<CountUserByTypeAndStatusDto> countOfCustomersForGraph()
    {
        return ResponseEntity.ok(userService.countOfCustomersForGraph());
    }

    @PostMapping(FIND_EMPLOYEES_WITH_UPCOMING_BIRTHDAYS)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<User>> findEmployeesWithUpcomingBirthdays()
    {
        return ResponseEntity.ok(userService.findEmployeesWithUpcomingBirthdays());
    }

    @PostMapping(FIND_MONTHLY_SALARY_OF_EMPLOYEES)
    @CrossOrigin("*")
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<MonthlySalaryOfEmployeesDto>> findMonthlySalaryOfEmployees()
    {
        return ResponseEntity.ok(userService.findMonthlySalaryOfEmployees());
    }
}
