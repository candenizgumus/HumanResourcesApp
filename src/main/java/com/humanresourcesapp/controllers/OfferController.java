package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.OfferApproveRequestDto;
import com.humanresourcesapp.dto.requests.OfferSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageCountRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.services.OfferService;
import com.humanresourcesapp.views.VwGetAllOffer;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT+OFFER)
@CrossOrigin("*")
public class OfferController
{
    private final OfferService offerService;

    @PostMapping(SAVE)
    public ResponseEntity<Boolean> save(@Valid @RequestBody OfferSaveRequestDto dto)
    {
        return ResponseEntity.ok(offerService.saveWithDto(dto));
    }

    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<List<VwGetAllOffer>> getAllOffer(@RequestBody PageRequestDto dto)
    {
        return ResponseEntity.ok(offerService.getAllOffer(dto));
    }

    @PostMapping(APPROVE_OFFER_AND_REGISTER_AUTH_AND_USER)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Boolean> approveOfferAndRegisterAuthAndUser(@RequestBody OfferApproveRequestDto dto){

        return ResponseEntity.ok(offerService.approveOfferAndRegisterAuthAndUser(dto));
    }

    @DeleteMapping(DECLINE_OFFER)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Boolean> delete( Long offerId)
    {
        return ResponseEntity.ok(offerService.delete(offerId));
    }


    @PostMapping(GET_COUNT)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Long> getCount(@RequestBody PageCountRequestDto dto)
    {
        return ResponseEntity.ok(offerService.getCount(dto));
    }
}
