package lk.ijse.backend.service;

import lk.ijse.backend.dto.JobDTO;
import lk.ijse.backend.entity.Job;

import java.util.List;
import java.util.Optional;

public interface JobService {
    String postJob(JobDTO jobDTO);          // Create
    List<Job> getAllJobs();                 // View All (For Seekers)
    Optional<JobDTO> getJobById(Long id);               // View Single Job
    List<Job> getJobsByCompany(Long companyId); // View Employer's Jobs
    String updateJob(Long id, JobDTO jobDTO);   // Update
    String deleteJob(Long id);              // Delete
    List<JobDTO> searchJobs(String title, String location);
    List<JobDTO> getJobsByUserEmail(String email);
}
