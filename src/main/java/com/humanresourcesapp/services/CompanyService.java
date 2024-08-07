package com.humanresourcesapp.services;

import com.humanresourcesapp.dto.requests.CompanySaveRequestDto;
import com.humanresourcesapp.dto.requests.PageCountRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.CompanyRepository;
import com.humanresourcesapp.views.VwGetCompanyLogos;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService
{
    private final CompanyRepository companyRepository;

    public Company save(CompanySaveRequestDto dto)
    {
        return companyRepository.save(Company.builder().name(dto.name()).logo(dto.logo()).build());
    }

    public Optional<Company> findById(Long id)
    {
        return companyRepository.findById(id);
    }

    public List<VwGetCompanyLogos> getAll() {
        return companyRepository.findAllCompanyLogos();
    }

    public void saveAll(List<Company> companyList) {
        companyRepository.saveAll(companyList);
    }

    public List<Company> getAllByPage(PageRequestDto dto) {
        return companyRepository.getAllByPageBySearch(dto.searchText(),PageRequest.of(dto.page(), dto.pageSize()));
    }

    public Company update (CompanySaveRequestDto dto){
        Company company = companyRepository.findById(dto.id()).orElseThrow(() -> new HumanResourcesAppException(ErrorType.COMPANY_NOT_FOUND));
        if(!isNullOrWhitespace(dto.name())){
            company.setName(dto.name());
        }
        if (!isNullOrWhitespace(dto.logo())){
            company.setLogo(dto.logo());
        }
        if (!isNullOrWhitespace(dto.description())){
            company.setDescription(dto.description());
        }
        if (dto.numberOfEmployee() != null){
            company.setNumberOfEmployee(dto.numberOfEmployee());
        }

        return companyRepository.save(company);
    }

    /**
     * Checks if the given string is null, empty, or contains only whitespace.
     *
     * @param str the string to check
     * @return true if the string is null, empty, or contains only whitespace; false otherwise
     */
    public static boolean isNullOrWhitespace(String str) {
        return str == null || str.trim().isEmpty();
    }

    public Long getCount(PageCountRequestDto dto) {
        return companyRepository.getAllByPageBySearchCount(dto.searchText());
    }
}
