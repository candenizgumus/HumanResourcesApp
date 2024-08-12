package com.humanresourcesapp.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class MonthlySalaryOfEmployeesDto
{
    Long id;
    String name;
    String surname;
    String email;
    Double salary;
    Double extraPayments;
    Double total;
}
