package lk.ijse.backend.controller;

import jakarta.validation.Valid;
import lk.ijse.backend.dto.CompanyDTO;
import lk.ijse.backend.entity.Company;
import lk.ijse.backend.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/company")
@CrossOrigin("*")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping(value = "/add", consumes = { "multipart/form-data" })
    public ResponseEntity<String> addCompany(
             @Valid @RequestPart("company") String companyJson,
            @RequestPart("logo") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {

        com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
        CompanyDTO companyDTO = objectMapper.readValue(companyJson, CompanyDTO.class);

        return ResponseEntity.ok(companyService.addCompanyWithFile(companyDTO, file));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CompanyDTO> getCompanyByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(companyService.getCompanyByUserId(userId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateCompany(@PathVariable Long id, @RequestBody CompanyDTO companyDTO) {
        return ResponseEntity.ok(companyService.updateCompany(id, companyDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDTO> getCompanyById(@PathVariable Long id) {
        CompanyDTO companyDTO = companyService.getCompanyById(id);
        return ResponseEntity.ok(companyDTO);
    }

    @GetMapping("/names")
    public List<String> getAllCompanyNames() {
        return companyService.getAllCompanyNames();
    }
}