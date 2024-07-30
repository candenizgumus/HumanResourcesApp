package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.OfferSaveRequestDto;
import com.humanresourcesapp.services.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/offer")
@CrossOrigin("*")
public class OfferController
{
    private final OfferService offerService;

    @PostMapping("/save")
    public ResponseEntity<Boolean> save(OfferSaveRequestDto dto)
    {
        return ResponseEntity.ok(offerService.save(dto));
    }
}
