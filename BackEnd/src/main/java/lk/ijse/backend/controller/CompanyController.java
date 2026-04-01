package lk.ijse.backend.controller;

import jakarta.validation.Valid;
import lk.ijse.backend.dto.CompanyDTO;
import lk.ijse.backend.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company")
@CrossOrigin("*")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    // Register Company
    @PostMapping(value = "/add", consumes = { "multipart/form-data" })
    public ResponseEntity<String> addCompany(
             @Valid @RequestPart("company") String companyJson,
            @RequestPart("logo") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {

        // JSON String එක DTO එකකට හරවගන්නවා
        com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
        CompanyDTO companyDTO = objectMapper.readValue(companyJson, CompanyDTO.class);

        // මෙතනදී file එක save කරලා ඒකෙ නම DTO එකට දාන logic එක Service එකට යවන්න
        return ResponseEntity.ok(companyService.addCompanyWithFile(companyDTO, file));
    }

    // Get All Companies
    @GetMapping("/all")
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    // Get Company by User ID (Login wela inna employer ta thamage profile eka ganna)
    @GetMapping("/user/{userId}")
    public ResponseEntity<CompanyDTO> getCompanyByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(companyService.getCompanyByUserId(userId));
    }

    // Update Company
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateCompany(@PathVariable Long id, @RequestBody CompanyDTO companyDTO) {
        return ResponseEntity.ok(companyService.updateCompany(id, companyDTO));
    }
}