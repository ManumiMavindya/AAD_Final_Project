package lk.ijse.backend.service.impl;

import lk.ijse.backend.dto.CompanyDTO;
import lk.ijse.backend.entity.Company;
import lk.ijse.backend.repository.CompanyRepository;
import lk.ijse.backend.repository.UserRepository;
import lk.ijse.backend.service.CompanyService;
import lk.ijse.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String addCompany(CompanyDTO companyDTO) {
        User user = userRepository.findById(companyDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = new Company();
        company.setCompanyName(companyDTO.getCompanyName());
        company.setLocation(companyDTO.getLocation());
        company.setDescription(companyDTO.getDescription());
        company.setUser(user);

        companyRepository.save(company);
        return "Company registered successfully!";
    }

    @Override
    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream().map(company -> {
            CompanyDTO dto = new CompanyDTO();
            dto.setId(company.getId());
            dto.setCompanyName(company.getCompanyName());
            dto.setLocation(company.getLocation());
            dto.setDescription(company.getDescription());
            dto.setUserId(company.getUser().getId());
            return dto;
        }).collect(Collectors.toList());    }


    @Override
    public CompanyDTO getCompanyById(String id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setCompanyName(company.getCompanyName());
        dto.setUserId(company.getUser().getId());
        return dto;    }

    @Override
    public CompanyDTO getCompanyByUserId(String userId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Company not found for this user"));

        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setCompanyName(company.getCompanyName());
        dto.setLocation(company.getLocation());
        dto.setUserId(company.getUser().getId());
        return dto;    }

    @Override
    public String updateCompany(String id, CompanyDTO companyDTO) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setCompanyName(dto.getCompanyName());
        company.setLocation(dto.getLocation());
        company.setDescription(dto.getDescription());

        companyRepository.save(company);
        return "Company updated successfully!";    }
}
