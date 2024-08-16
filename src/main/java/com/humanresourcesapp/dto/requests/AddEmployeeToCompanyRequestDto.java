package com.humanresourcesapp.dto.requests;

import jakarta.validation.constraints.Email;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public record AddEmployeeToCompanyRequestDto(
                                             String title,
                                             @Email(message = "Not a valid Email")
                                             String email,
                                             String name,
                                             String surname,
                                             String phone,
                                             String location,
                                             LocalDate birthDate,
                                             LocalDate hireDate,
                                             String position,
                                             String employeeType,
                                             Double salary,
                                             MultipartFile photo


)
{
}
