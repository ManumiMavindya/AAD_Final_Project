package lk.ijse.backend.service;

import lk.ijse.backend.dto.CompanyDTO;

import java.util.List;

public interface CompanyService {
    String addCompany(CompanyDTO companyDTO);
    List<CompanyDTO> getAllCompanies();
    CompanyDTO getCompanyById(String id);
    CompanyDTO getCompanyByUserId(String userId);
    String updateCompany(String id, CompanyDTO companyDTO);
}
