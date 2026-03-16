package lk.ijse.backend.service;

import lk.ijse.backend.dto.JobDTO;
import lk.ijse.backend.entity.Job;

import java.util.List;

public interface JobService {
    String postJob(JobDTO jobDTO);          // Create
    List<Job> getAllJobs();                 // View All (For Seekers)
    Job getJobById(Long id);                // View Single Job
    List<Job> getJobsByCompany(Long companyId); // View Employer's Jobs
    String updateJob(Long id, JobDTO jobDTO);   // Update
    String deleteJob(Long id);              // Delete
}
