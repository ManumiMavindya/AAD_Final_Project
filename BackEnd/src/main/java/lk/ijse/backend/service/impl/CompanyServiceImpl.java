package lk.ijse.backend.service.impl;

import lk.ijse.backend.dto.CompanyDTO;
import lk.ijse.backend.entity.Company;
import lk.ijse.backend.repository.CompanyRepository;
import lk.ijse.backend.repository.UserRepository;
import lk.ijse.backend.service.CompanyService;
import lk.ijse.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String addCompany(CompanyDTO dto) {
        // 1. Token එකෙන් දැනට ඉන්න User ගේ Email එක ගන්නවා
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. ඒ Email එකෙන් User Entity එක හොයාගන්නවා
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Logged in user not found"));

        Company company = new Company();
        company.setCompanyName(dto.getCompanyName());
        company.setLocation(dto.getLocation());
        company.setDescription(dto.getDescription());
        company.setLogoUrl(dto.getLogoUrl());
        company.setWebsite(dto.getWebsite());
        company.setIndustry(dto.getIndustry());
        company.setContactEmail(dto.getContactEmail());

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
            dto.setLogoUrl(company.getLogoUrl());
            dto.setWebsite(company.getWebsite());
            dto.setIndustry(company.getIndustry());
            dto.setContactEmail(company.getContactEmail());
            dto.setUserId(company.getUser().getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public CompanyDTO getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setCompanyName(company.getCompanyName());
        dto.setUserId(company.getUser().getId());
        return dto;
    }

    @Override
    public CompanyDTO getCompanyByUserId(Long userId) {
        // 1. Company එක හොයනවා
        Company company = companyRepository.findByUserId(userId).orElse(null);

        // 2. වැදගත්ම කොටස: Company එකක් නැත්නම් Error එකක් නොදී null යවන්න
        if (company == null) {
            return null;
        }

        // 3. Company එකක් තිබුණොත් විතරක් DTO එකට දාන්න
        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setCompanyName(company.getCompanyName());
        dto.setLocation(company.getLocation());
        dto.setDescription(company.getDescription());
        dto.setLogoUrl(company.getLogoUrl());
        dto.setWebsite(company.getWebsite());
        dto.setIndustry(company.getIndustry());
        dto.setContactEmail(company.getContactEmail());
        dto.setUserId(company.getUser().getId());
        return dto;
    }

    @Override
    public String updateCompany(Long id, CompanyDTO dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setCompanyName(dto.getCompanyName());
        company.setLocation(dto.getLocation());
        company.setDescription(dto.getDescription());
        company.setLogoUrl(dto.getLogoUrl());
        company.setWebsite(dto.getWebsite());
        company.setIndustry(dto.getIndustry());
        company.setContactEmail(dto.getContactEmail());

        companyRepository.save(company);
        return "Company updated successfully!";
    }
}