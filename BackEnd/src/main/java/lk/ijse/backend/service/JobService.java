package lk.ijse.backend.service;

import lk.ijse.backend.dto.JobDTO;
import lk.ijse.backend.entity.Job;

import java.util.List;

public interface JobService {
    String postJob(JobDTO jobDTO);          // Create
    List<Job> getAllJobs();                 // View All (For Seekers)
    Job getJobById(String id);                // View Single Job
    List<Job> getJobsByCompany(String companyId); // View Employer's Jobs
    String updateJob(String id, JobDTO jobDTO);   // Update
    String deleteJob(String id);              // Delete
}
