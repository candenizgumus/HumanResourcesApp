package com.humanresourcesapp.controllers;

import com.humanresourcesapp.dto.requests.CompanySaveRequestDto;
import com.humanresourcesapp.dto.requests.PageCountRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.dto.requests.UpdateCompanyByManagerDto;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.services.CompanyService;
import com.humanresourcesapp.views.VwGetCompanyLogos;
import com.humanresourcesapp.views.VwUpcomingMembershipExpiry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import static com.humanresourcesapp.constants.Endpoints.*;
@RequestMapping(ROOT+COMPANY)
@RequiredArgsConstructor
@RestController
public class CompanyController
{
    private final CompanyService companyService;

    @PostMapping(SAVE)
    public ResponseEntity<Company> save(@RequestBody CompanySaveRequestDto dto)
    {
        return ResponseEntity.ok(companyService.save(dto));
    }

    @GetMapping(GET_ALL_COMPANY_LOGOS)
    public ResponseEntity<List<VwGetCompanyLogos>> getAll()
    {
        return ResponseEntity.ok(companyService.getAll());
    }


    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<List<Company>> getAll(@RequestBody PageRequestDto dto)
    {
        return ResponseEntity.ok(companyService.getAllByPage(dto));
    }

    @PostMapping(GET_COUNT)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Long> getCount(@RequestBody PageCountRequestDto dto)
    {
        return ResponseEntity.ok(companyService.getCount(dto));
    }

    @PostMapping(UPDATE)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Company> update(@RequestBody CompanySaveRequestDto dto)
    {
        return ResponseEntity.ok(companyService.update(dto));
    }

    // I don't remember why I wrote this method. Aslan
    @GetMapping("/getCompanyCountByMonth")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Map<Integer, Long>> getAy()
    {
        return ResponseEntity.ok(companyService.getCompanyCountByMonthForCurrentYear());
    }

    @PostMapping(GET_COMPANY_OF_MANAGER)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Company> getCompanyOfManager()
    {
        return ResponseEntity.ok(companyService.getCompanyOfManager());
    }

    @PutMapping(UPDATE_COMPANY_BY_MANAGER)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<Company> updateCompanyByManager(
                                                          @RequestParam("name") String name,
                                                          @RequestParam("description") String description,
                                                          @RequestParam("country") String country,
                                                          @Nullable @RequestParam("photo") MultipartFile photo)
    {
        return ResponseEntity.ok(companyService.updateWithPhoto( name, description,country, photo));
    }

    @PostMapping("/get-upcoming-membership-expiries")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<List<VwUpcomingMembershipExpiry>> getUpcomingMembershipExpiries()
    {
        return ResponseEntity.ok(companyService.getUpcomingMembershipExpiries());
    }
}
