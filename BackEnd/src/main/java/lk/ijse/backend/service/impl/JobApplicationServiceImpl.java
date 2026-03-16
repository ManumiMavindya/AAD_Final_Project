package lk.ijse.backend.service.impl;

import jakarta.transaction.Transactional;
import lk.ijse.backend.dto.JobApplicationDTO;
import lk.ijse.backend.entity.Job;
import lk.ijse.backend.entity.JobApplication;
import lk.ijse.backend.entity.User;
import lk.ijse.backend.repository.JobApplicationRepository;
import lk.ijse.backend.repository.JobRepository;
import lk.ijse.backend.repository.UserRepository;
import lk.ijse.backend.service.EmailService;
import lk.ijse.backend.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public String applyForJob(JobApplicationDTO dto) {
        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setUser(user);
        application.setApplicationDate(LocalDate.now());
        application.setStatus("PENDING");

        applicationRepository.save(application);
        return "Application submitted successfully!";
    }

    @Override
    public String applyWithCv(Long jobId, Long userId, MultipartFile file) {
        try {
            // 1. File එක save කරන path එක
            String uploadDir = "C:/JobHub/CVs/";
            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            // File එකේ නම unique කරගන්න Seeker ID සහ Job ID එකතු කරනවා
            String fileName = userId + "_" + jobId + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);

            // File එක නියමිත folder එකට copy කරනවා
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 2. Database එකේ data save කිරීම
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            JobApplication application = new JobApplication();
            application.setJob(job);
            application.setUser(user);
            application.setApplicationDate(LocalDate.now());
            application.setStatus("PENDING");
            application.setCvPath(filePath.toString()); // Path එක String එකක් විදිහට save වෙනවා

            applicationRepository.save(application);

            // 1. Seeker ට confirmation mail එකක් යැවීම
            String seekerEmail = user.getEmail();
            emailService.sendSimpleEmail(
                    seekerEmail,
                    "Application Received",
                    "Hi " + user.getName() + ", you applied for " + job.getTitle() + " successfully!"
            );

            // 2. Employer ට notification mail එකක් යැවීම
            // Company එක අයිති User (Employer) ගේ email එක මෙතනින් ගන්නවා
            String employerEmail = job.getCompany().getUser().getEmail();
            emailService.sendSimpleEmail(
                    employerEmail,
                    "New Applicant for " + job.getTitle(),
                    "Hello, a new candidate (" + user.getName() + ") has applied for your job post."
            );

            return "Applied successfully! Emails sent to Seeker and Employer.";

        } catch (IOException e) {
            throw new RuntimeException("Could not store file. Error: " + e.getMessage());
        }

    }

    @Override
    public List<JobApplicationDTO> getApplicationsByJobId(Long jobId) {
// Job එකට අදාළ applications list එක අරගෙන DTO වලට convert කරනවා
        return applicationRepository.findAll().stream()
                .filter(app -> app.getJob().getId().equals(jobId))
                .map(app -> new JobApplicationDTO(
                        app.getId(),
                        app.getJob().getId(),
                        app.getUser().getId(),
                        app.getApplicationDate(),
                        app.getStatus(),
                        app.getCvPath()
                )).collect(Collectors.toList());    }

    @Override
    public Resource downloadCv(Long applicationId) {
        try {
            JobApplication app = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            Path filePath = Paths.get(app.getCvPath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found on server");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }    }

    @Override
    public String updateApplicationStatus(Long applicationId, String status) {
        // 1. Application එක සොයා ගැනීම
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // 2. Status එක update කිරීම
        application.setStatus(status);
        applicationRepository.save(application);

        // 3. Seeker ට Notification එකක් යැවීම
        String seekerEmail = application.getUser().getEmail();
        String jobTitle = application.getJob().getTitle();

        String subject = "Update on your application for " + jobTitle;
        String body = "Dear " + application.getUser().getName() + ",\n\n" +
                "Your application for the " + jobTitle + " position has been " + status + ".\n" +
                "Please log in to JobHub for more details.";

        emailService.sendSimpleEmail(seekerEmail, subject, body);

        return "Application status updated to " + status + " and seeker notified.";
    }

}
