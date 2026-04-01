package lk.ijse.backend.service;

import lk.ijse.backend.dto.JobApplicationDTO;
import lk.ijse.backend.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface JobApplicationService {
    String applyWithCv(Long jobId, Long userId, MultipartFile file, String contactNo);
    List<JobApplicationDTO> getApplicationsByJobId(Long jobId);
    org.springframework.core.io.Resource downloadCv(Long applicationId);
    String updateApplicationStatus(Long applicationId, String status);
    List<JobApplicationDTO> getApplicationsByUserId(Long userId);
    ResponseEntity<UserDTO> getUserDetailsById(Long userId);

}
