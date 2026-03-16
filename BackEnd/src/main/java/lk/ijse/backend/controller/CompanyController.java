package lk.ijse.backend.controller;

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
    @PostMapping("/add")
    public ResponseEntity<String> addCompany(@RequestBody CompanyDTO companyDTO) {
        return ResponseEntity.ok(companyService.addCompany(companyDTO));
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