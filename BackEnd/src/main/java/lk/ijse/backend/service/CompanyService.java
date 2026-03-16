package lk.ijse.backend.service;

import lk.ijse.backend.dto.CompanyDTO;

import java.util.List;

public interface CompanyService {
    String addCompany(CompanyDTO companyDTO);
    List<CompanyDTO> getAllCompanies();
    CompanyDTO getCompanyById(Long id);
    CompanyDTO getCompanyByUserId(Long userId);
    String updateCompany(Long id, CompanyDTO companyDTO);
}
