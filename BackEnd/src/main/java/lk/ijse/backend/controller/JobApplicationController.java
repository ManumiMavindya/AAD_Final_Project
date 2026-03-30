package lk.ijse.backend.controller;

import lk.ijse.backend.dto.JobApplicationDTO;
import lk.ijse.backend.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/apply")
@CrossOrigin("*")
public class JobApplicationController {

    @Autowired
    private JobApplicationService applicationService;

    @PostMapping(value = "/submit-with-cv", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<String> applyWithCv(
            @RequestParam("jobId") Long jobId,
            @RequestParam("userId") Long userId,
            @RequestParam("contactNo") String contactNo,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(applicationService.applyWithCv(jobId, userId, file, contactNo));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplicationDTO>> getApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(jobId));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Resource resource = applicationService.downloadCv(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PatchMapping("/update-status/{id}")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }
}