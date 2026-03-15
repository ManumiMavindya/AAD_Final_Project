package lk.ijse.backend.controller;

import lk.ijse.backend.dto.JobDTO;
import lk.ijse.backend.entity.Job;
import lk.ijse.backend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin("*")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping("/post")
    public ResponseEntity<String> postJob(@RequestBody JobDTO jobDTO) {
        return ResponseEntity.ok(jobService.postJob(jobDTO));
    }

    // View All Jobs
    @GetMapping("/all")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // View Company Specific Jobs (Employer Dashboard ekata)
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Job>> getJobsByCompany(@PathVariable String companyId) {
        return ResponseEntity.ok(jobService.getJobsByCompany(companyId));
    }

    // Update Job
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateJob(@PathVariable String id, @RequestBody JobDTO jobDTO) {
        return ResponseEntity.ok(jobService.updateJob(id, jobDTO));
    }

    // Delete Job
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable String id) {
        return ResponseEntity.ok(jobService.deleteJob(id));
    }
}