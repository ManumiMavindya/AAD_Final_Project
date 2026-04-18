package lk.ijse.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface AtsService {
    String extractTextFromPdf(MultipartFile file) throws Exception;
    String checkCompatibilityWithGemini(String resumeText, String jobDescription) throws Exception;
}
