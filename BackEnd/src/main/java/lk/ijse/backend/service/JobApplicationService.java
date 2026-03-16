package lk.ijse.backend.service;

import lk.ijse.backend.dto.JobApplicationDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface JobApplicationService {
    String applyForJob(JobApplicationDTO dto);
    String applyWithCv(Long jobId, Long userId, MultipartFile file);
    List<JobApplicationDTO> getApplicationsByJobId(Long jobId);
    org.springframework.core.io.Resource downloadCv(Long applicationId);
    String updateApplicationStatus(Long applicationId, String status);
}
