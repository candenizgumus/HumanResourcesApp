package com.humanresourcesapp.services;


import com.humanresourcesapp.dto.requests.CompanyItemSaveRequestDto;
import com.humanresourcesapp.entities.CompanyItem;
import com.humanresourcesapp.repositories.CompanyItemRepository;
import com.humanresourcesapp.utility.JwtTokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CompanyItemService {

    private final CompanyItemRepository companyItemRepository;
    private final JwtTokenManager jwtTokenManager;

    public CompanyItem save(CompanyItemSaveRequestDto dto) {
        return companyItemRepository.save(
                CompanyItem.builder()
                        .companyId(dto.companyId())
                        .description(dto.description())
                        .name(dto.name())
                        .build()
        );
    }

    //Company id'yi nerden alicam. Token'in
    public List<CompanyItem> findAll() {
//        String token =(String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        return companyItemRepository.findByCompanyId(jwtTokenManager.getAuthIdFromToken());
        return List.of(new CompanyItem());
    }

}
