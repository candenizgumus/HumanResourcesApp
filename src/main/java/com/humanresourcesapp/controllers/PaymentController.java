package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.PaymentSaveRequestDto;
import com.humanresourcesapp.entities.Payment;
import com.humanresourcesapp.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT+PAYMENT)
@RequiredArgsConstructor
@CrossOrigin("*")
public class PaymentController
{
    private final PaymentService paymentService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<Boolean> save(@RequestBody PaymentSaveRequestDto dto)
    {
        return ResponseEntity.ok(paymentService.save(dto));
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<Payment>> getAll(@RequestBody PageRequestDto dto)
    {
        return ResponseEntity.ok(paymentService.getAll(dto));
    }

    @DeleteMapping(DELETE)
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<Boolean> delete(Long id)
    {
        return ResponseEntity.ok(paymentService.delete(id));
    }

    @PostMapping(GET_MONTHLY_PAYMENTS)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<Payment>> getMonthlyPayments()
    {
        return ResponseEntity.ok(paymentService.getMonthlyPayments());
    }
}
