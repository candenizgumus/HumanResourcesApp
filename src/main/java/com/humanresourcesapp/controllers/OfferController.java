package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.OfferSaveRequestDto;
import com.humanresourcesapp.services.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+OFFER)
@CrossOrigin("*")
public class OfferController
{
    private final OfferService offerService;

    @PostMapping(SAVE)
    public ResponseEntity<Boolean> save(@RequestBody OfferSaveRequestDto dto)
    {
        return ResponseEntity.ok(offerService.save(dto));
    }
}
