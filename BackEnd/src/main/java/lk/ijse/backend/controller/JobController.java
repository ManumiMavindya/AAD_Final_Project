package lk.ijse.backend.controller;

import lk.ijse.backend.dto.JobDTO;
import lk.ijse.backend.entity.Job;
import lk.ijse.backend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin("*")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping("/add")
    public ResponseEntity<String> addJob(@RequestBody JobDTO jobDTO) {
        return ResponseEntity.ok(jobService.postJob(jobDTO));
    }

    // View All Jobs
    @GetMapping("/all")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // View Company Specific Jobs (Employer Dashboard ekata)
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Job>> getJobsByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(jobService.getJobsByCompany(companyId));
    }

    // Update Job
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateJob(@PathVariable Long id, @RequestBody JobDTO jobDTO) {
        return ResponseEntity.ok(jobService.updateJob(id, jobDTO));
    }

    // Delete Job
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.deleteJob(id));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobDTO>> getMyJobs(Authentication authentication) {
        String email = authentication.getName(); // Token එකෙන් email එක ගන්නවා
        List<JobDTO> myJobs = jobService.getJobsByUserEmail(email);
        return ResponseEntity.ok(myJobs);
    }
}