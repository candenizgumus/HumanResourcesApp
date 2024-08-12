package com.humanresourcesapp.dto.responses;

public record MonthlySalaryOfEmployeesDto(Long id,
                                          String name,
                                          String surname,
                                          String email,
                                          Double salary,
                                          Double extraPayments,
                                          Double total)
{
}
