package lk.ijse.backend.service;

import lk.ijse.backend.dto.JobDTO;
import lk.ijse.backend.entity.Job;

import java.util.List;
import java.util.Optional;

public interface JobService {
    String postJob(JobDTO jobDTO);
    List<Job> getAllJobs();
    Optional<JobDTO> getJobById(Long id);
    List<Job> getJobsByCompany(Long companyId);
    String updateJob(Long id, JobDTO jobDTO);
    String deleteJob(Long id);
    List<JobDTO> searchJobs(String title, String location);
    List<JobDTO> getJobsByUserEmail(String email);
}
