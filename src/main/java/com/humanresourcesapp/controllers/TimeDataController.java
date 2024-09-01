package com.humanresourcesapp.controllers;

import  static com.humanresourcesapp.constants.Endpoints.*;

import com.humanresourcesapp.dto.requests.TimeDataGetRequestDto;
import com.humanresourcesapp.dto.responses.TimeDatasResponseDto;
import com.humanresourcesapp.entities.TimeData;
import com.humanresourcesapp.services.TimeDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ROOT+TIMEDATA)
@RequiredArgsConstructor
@CrossOrigin("*")
public class TimeDataController
{
    private final TimeDataService timeDataService;

    @PostMapping(GET_ALL_USERNAMES)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<String>> findAllDistinctUsernames() {
        return ResponseEntity.ok(timeDataService.findAllDistinctUsernames());
    }

    @PostMapping(GET_USERNAMES_SLIDES)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<String>> getUsernamesSlides(String userName) {
        return ResponseEntity.ok(timeDataService.getUsernamesSlides(userName));
    }

    @PostMapping(GET_ALL_BY_USERNAME_SLIDEID)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<List<TimeDatasResponseDto>> getAllByUsernameAndSlideId(@RequestBody TimeDataGetRequestDto dto)  {
        return ResponseEntity.ok(timeDataService.getAllByUsernameAndSlideId(dto));
    }


}
