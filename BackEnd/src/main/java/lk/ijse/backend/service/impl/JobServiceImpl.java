package lk.ijse.backend.service.impl;

import lk.ijse.backend.dto.JobDTO;
import lk.ijse.backend.entity.Company;
import lk.ijse.backend.entity.Job;
import lk.ijse.backend.entity.User;
import lk.ijse.backend.repository.CompanyRepository;
import lk.ijse.backend.repository.JobRepository;
import lk.ijse.backend.repository.UserRepository;
import lk.ijse.backend.service.JobService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public String postJob(JobDTO jobDTO) {

        Company company = companyRepository.findById(jobDTO.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found!"));

        String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Job job = new Job();
        job.setTitle(jobDTO.getTitle());
        job.setDescription(jobDTO.getDescription());
        job.setSalary(jobDTO.getSalary());
        job.setJobType(jobDTO.getJobType());
        job.setLocation(jobDTO.getLocation());
        job.setWorkArrangement(jobDTO.getWorkArrangement());
        job.setExperienceLevel(jobDTO.getExperienceLevel());
        job.setPostedDate(java.time.LocalDateTime.now());

        job.setCompany(company);
        job.setUser(currentUser);

        jobRepository.save(job);
        return "Job posted successfully!";
    }

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public Optional<JobDTO> getJobById(Long id) {
        return jobRepository.findById(id)
                .map(job -> modelMapper.map(job, JobDTO.class));
    }

    @Override
    public List<Job> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    @Override
    public String updateJob(Long id, JobDTO jobDTO) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        existingJob.setTitle(jobDTO.getTitle());
        existingJob.setDescription(jobDTO.getDescription());
        existingJob.setSalary(jobDTO.getSalary());
        existingJob.setLocation(jobDTO.getLocation());

        jobRepository.save(existingJob);
        return "Job updated successfully!";
    }

    @Override
    public String deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job not found!");
        }
        jobRepository.deleteById(id);
        return "Job deleted successfully!";
    }

    @Override
    public List<JobDTO> searchJobs(String title, String location) {
        List<Job> jobs;

        if (title != null && location != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCaseAndLocationIgnoreCase(title, location);
        } else if (title != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCase(title);
        } else if (location != null) {
            jobs = jobRepository.findByLocationIgnoreCase(location);
        } else {
            jobs = jobRepository.findAll();
        }
        return jobs.stream().map(job -> new JobDTO(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getSalary(),
                job.getJobType(),
                job.getLocation(),
                job.getWorkArrangement(),
                job.getExperienceLevel(),
                job.getCompany().getId(),
                job.getPostedDate()
        )).collect(Collectors.toList());
    }

    @Override
    public List<JobDTO> getJobsByUserEmail(String email) {
        List<Job> jobs = jobRepository.findByUserEmail(email);

        return jobs.stream()
                .map(job -> modelMapper.map(job, JobDTO.class))
                .collect(Collectors.toList());
    }
}