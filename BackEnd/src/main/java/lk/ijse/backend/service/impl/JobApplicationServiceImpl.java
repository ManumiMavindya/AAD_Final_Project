package lk.ijse.backend.service.impl;

import jakarta.transaction.Transactional;
import lk.ijse.backend.dto.JobApplicationDTO;
import lk.ijse.backend.dto.UserDTO;
import lk.ijse.backend.entity.Job;
import lk.ijse.backend.entity.JobApplication;
import lk.ijse.backend.entity.User;
import lk.ijse.backend.repository.JobApplicationRepository;
import lk.ijse.backend.repository.JobRepository;
import lk.ijse.backend.repository.UserRepository;
import lk.ijse.backend.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
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
    private EmailServiceImpl emailService;

    @Override
    public String applyWithCv(Long jobId, Long userId, MultipartFile file, String contactNo) {
        try {
            // 1. File එක save කරන path එක
            String uploadDir = "C:/JobHub/CVs/";
            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            String fileName = userId + "_" + jobId + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
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
            application.setContactNo(contactNo);
            application.setCvPath(filePath.toString());

            applicationRepository.save(application);

            // --- HTML EMAIL TEMPLATES ---

            // 1. Seeker (අයදුම්කරු) සඳහා HTML එක
            String seekerHtml =
                    "<div style='font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 25px; border-radius: 12px; max-width: 600px;'>" +
                            "<h2 style='color: #2ecc71;'>Application Received! ✅</h2>" +
                            "<p>Hi <b>" + user.getName() + "</b>,</p>" +
                            "<p>You have successfully applied for <b>" + job.getTitle() + "</b> at <b>" + job.getCompany().getCompanyName() + "</b>.</p>" +
                            "<div style='background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;'>" +
                            "<p style='margin: 0; color: #7f8c8d;'>The employer has been notified. They will review your application soon.</p>" +
                            "</div>" +
                            "<p style='font-size: 12px; color: #bdc3c7;'>Regards, <br>JobHub Team</p>" +
                            "</div>";

            // 2. Employer (සමාගම) සඳහා HTML එක (With Professional Note & Branding)
            String employerHtml =
                    "<div style='font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 25px; border-radius: 12px; max-width: 600px;'>" +
                            "<h2 style='color: #2c3e50;'>New Applicant Alert! 📧</h2>" +
                            "<p>Hello <b>" + job.getCompany().getCompanyName() + "</b>,</p>" +
                            "<p>A new candidate has applied for your job post: <b style='color: #2980b9;'>" + job.getTitle() + "</b></p>" +

                            "<table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>" +
                            "<tr><td style='padding: 10px; border: 1px solid #eee;'><b>Name:</b></td><td style='padding: 10px; border: 1px solid #eee;'>" + user.getName() + "</td></tr>" +
                            "<tr><td style='padding: 10px; border: 1px solid #eee;'><b>Email:</b></td><td style='padding: 10px; border: 1px solid #eee;'>" + user.getEmail() + "</td></tr>" +
                            "<tr><td style='padding: 10px; border: 1px solid #eee;'><b>Contact No:</b></td><td style='padding: 10px; border: 1px solid #eee;'>" + contactNo + "</td></tr>" +
                            "</table>" +

                            // --- CV Attachment Note ---
                            "<div style='background-color: #fff9db; padding: 15px; border-radius: 8px; border: 1px dashed #f1c40f; margin-bottom: 20px;'>" +
                            "<p style='margin: 0; color: #856404; font-weight: bold;'>📎 Attachment Included:</p>" +
                            "<p style='margin: 5px 0 0 0; color: #856404; font-size: 14px;'>Please find the candidate's CV attached to this email for your review.</p>" +
                            "</div>" +

                            "<p style='color: #27ae60;'><b>Review the full profile on your JobHub dashboard.</b></p>" +

                            // --- Footer with Branding ---
                            "<hr style='border: 0; border-top: 1px solid #eee; margin-top: 25px;' />" +
                            "<div style='text-align: center;'>" +
                            "<p style='font-size: 12px; color: #95a5a6; margin: 0;'>This is an automated notification from your recruitment portal.</p>" +
                            "<p style='font-size: 13px; color: #7f8c8d; margin-top: 5px; font-weight: bold;'>" +
                            "Powered by <span style='color: #2980b9;'>JobHub</span> Recruitment System" +
                            "</p>" +
                            "</div>" +
                            "</div>";

            // --- EMAIL SENDING ---

            // 1. Seeker ට යවනවා (Attachment අවශ්‍ය නැත)
            emailService.sendHtmlEmail(user.getEmail(), "Application Confirmed: " + job.getTitle(), seekerHtml, filePath.toString());

            // 2. Employer ට යවනවා (Attachment සමඟ)
            String employerEmail = job.getCompany().getUser().getEmail();
            emailService.sendHtmlEmail(
                    employerEmail,
                    "New Applicant: " + job.getTitle(),
                    employerHtml,
                    filePath.toString()
            );

            return "Applied successfully! Professional emails sent.";

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
                        app.getContactNo(),
                        app.getCvPath(),
                        app.getJob().getTitle(),
                        app.getJob().getCompany().getCompanyName()
                )).collect(Collectors.toList());
    }

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

    @Override
    public List<JobApplicationDTO> getApplicationsByUserId(Long userId) {
        return applicationRepository.findAll().stream()
                .filter(app -> app.getUser().getId().equals(userId))
                .map(app -> new JobApplicationDTO(
                        app.getId(),
                        app.getJob().getId(),
                        app.getUser().getId(),
                        app.getApplicationDate(),
                        app.getStatus(),
                        app.getContactNo(),
                        app.getCvPath(),
                        app.getJob().getTitle(),
                        app.getJob().getCompany().getCompanyName()
                )).collect(Collectors.toList());
    }


    @Override
    public ResponseEntity<UserDTO> getUserDetailsById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName()); // ඔයාගේ Entity එකේ තියෙන විදියට (name/firstName)
        dto.setEmail(user.getEmail());

        return ResponseEntity.ok(dto);
    }
}
