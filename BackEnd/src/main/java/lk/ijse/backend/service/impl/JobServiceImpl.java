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
        // 1. Company එක හොයාගන්නවා
        Company company = companyRepository.findById(jobDTO.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found!"));

        // 2. දැනට Login වෙලා ඉන්න User ව (Employer) හොයාගන්නවා
        String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 3. Job Entity එකට data set කරනවා
        Job job = new Job();
        job.setTitle(jobDTO.getTitle());
        job.setDescription(jobDTO.getDescription());
        job.setSalary(jobDTO.getSalary());
        job.setJobType(jobDTO.getJobType());
        job.setLocation(jobDTO.getLocation());
        job.setWorkArrangement(jobDTO.getWorkArrangement());
        job.setExperienceLevel(jobDTO.getExperienceLevel());

        job.setCompany(company); // Company එක set කරනවා
        job.setUser(currentUser); // අන්න! දැන් තමයි Job එක සහ User අතර සම්බන්ධය හැදෙන්නේ ✅

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

    @Override
    public List<JobDTO> searchJobs(String title, String location) {
        List<Job> jobs;

        // Search logic එක (කලින් කතා කරපු එක)
        if (title != null && location != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCaseAndLocationIgnoreCase(title, location);
        } else if (title != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCase(title);
        } else if (location != null) {
            jobs = jobRepository.findByLocationIgnoreCase(location);
        } else {
            jobs = jobRepository.findAll();
        }

        // Stream එක පාවිච්චි කරලා List එකක් විදිහට return කරන තැන:
        return jobs.stream().map(job -> new JobDTO(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getSalary(),
                job.getJobType(),
                job.getLocation(),
                job.getWorkArrangement(),
                job.getExperienceLevel(),
                job.getCompany().getId()// Company name එක වගේ දේවල් DTO එකේ තිබේ නම්
        )).collect(Collectors.toList());
    }

    @Override
    public List<JobDTO> getJobsByUserEmail(String email) {
// 1. Database එකෙන් අදාළ email එකට තියෙන Jobs ටික ගන්නවා
        List<Job> jobs = jobRepository.findByUserEmail(email);

        // 2. ඒ Jobs (Entities) ටික JobDTO ලැයිස්තුවකට convert කරනවා
        return jobs.stream()
                .map(job -> modelMapper.map(job, JobDTO.class))
                .collect(Collectors.toList());    }


}