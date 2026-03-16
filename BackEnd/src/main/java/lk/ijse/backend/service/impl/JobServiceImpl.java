package lk.ijse.backend.service.impl;

import lk.ijse.backend.dto.JobDTO;
import lk.ijse.backend.entity.Company;
import lk.ijse.backend.entity.Job;
import lk.ijse.backend.repository.CompanyRepository;
import lk.ijse.backend.repository.JobRepository;
import lk.ijse.backend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    // 1. CREATE
    @Override
    public String postJob(JobDTO jobDTO) {
        Company company = companyRepository.findById(jobDTO.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found!"));

        Job job = new Job();
        job.setTitle(jobDTO.getTitle());
        job.setDescription(jobDTO.getDescription());
        job.setSalary(jobDTO.getSalary());
        job.setJobType(jobDTO.getJobType());
        job.setLocation(jobDTO.getLocation());
        job.setCompany(company);

        jobRepository.save(job);
        return "Job posted successfully!";
    }

    // 2. READ (Get All Jobs)
    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public Job getJobById(Long id) {
        return null;
    }

    // 3. READ (Get Jobs by Company) - Employer ta thamange jobs balanna
    @Override
    public List<Job> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    // 4. UPDATE
    @Override
    public String updateJob(Long id, JobDTO jobDTO) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        // Update fields
        existingJob.setTitle(jobDTO.getTitle());
        existingJob.setDescription(jobDTO.getDescription());
        existingJob.setSalary(jobDTO.getSalary());
        existingJob.setLocation(jobDTO.getLocation());

        jobRepository.save(existingJob);
        return "Job updated successfully!";
    }

    // 5. DELETE
    @Override
    public String deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job not found!");
        }
        jobRepository.deleteById(id);
        return "Job deleted successfully!";
    }
}