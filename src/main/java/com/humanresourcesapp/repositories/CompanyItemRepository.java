package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.CompanyItem;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyItemRepository extends JpaRepository<CompanyItem, Long> {

    //Only company manager can request this;
    List<CompanyItem> findByCompanyId(Long companyId);

    List<CompanyItem> findBySerialNumberContainingAndCompanyId(String serialNumber, Long companyId, PageRequest pageRequest);
}
