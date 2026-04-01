package lk.ijse.backend.service;

import lk.ijse.backend.dto.CompanyDTO;

import java.io.IOException;
import java.util.List;

public interface CompanyService {
    String addCompanyWithFile(CompanyDTO dto, org.springframework.web.multipart.MultipartFile file) throws IOException;
    List<CompanyDTO> getAllCompanies();
    CompanyDTO getCompanyById(Long id);
    CompanyDTO getCompanyByUserId(Long userId);
    String updateCompany(Long id, CompanyDTO companyDTO);
}
