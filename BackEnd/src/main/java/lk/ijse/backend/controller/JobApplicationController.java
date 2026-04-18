package lk.ijse.backend.controller;

import lk.ijse.backend.dto.JobApplicationDTO;
import lk.ijse.backend.dto.UserDTO;
import lk.ijse.backend.dto.JobDTO; // JobDetails ගන්න ඕන නිසා
import lk.ijse.backend.service.JobApplicationService;
import lk.ijse.backend.service.AtsService; // අලුතින් හදපු Service එක
import lk.ijse.backend.service.JobService; // Job Description එක ගන්න
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/apply")
@CrossOrigin("*")
public class JobApplicationController {

    @Autowired
    private JobApplicationService applicationService;

    @Autowired
    private AtsService atsService;

    @Autowired
    private JobService jobService;

    @PostMapping(value = "/submit-with-cv", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> applyWithCv(
            @RequestParam("jobId") Long jobId,
            @RequestParam("userId") Long userId,
            @RequestParam("contactNo") String contactNo,
            @RequestParam("file") MultipartFile file) {

        try {
            // 1. Job Description එක ලබා ගැනීම
// Optional එකෙන් JobDTO එක එළියට ගන්න .orElse(null) පාවිච්චි කරන්න
            JobDTO job = jobService.getJobById(jobId).orElse(null);
            if (job == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job details not found!");
            }

            // 2. Resume එකෙන් Text Extract කිරීම
            String resumeText = atsService.extractTextFromPdf(file);

            // 3. Gemini AI එක හරහා ATS Score එක බැලීම
            String aiResponseJson = atsService.checkCompatibilityWithGemini(resumeText, job.getDescription());

            // JSON Parse කිරීම
            JSONObject result = new JSONObject(aiResponseJson);
            int score = result.getInt("score");
            String feedback = result.getString("feedback");

            // 4. Score එක 60 ට අඩු නම් මෙතනින් Reject කරනවා
            if (score < 60) {
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of(
                        "status", "REJECTED",
                        "score", score,
                        "feedback", feedback,
                        "message", "Your resume match is only " + score + "%. Please include the required skills and try again to meet the minimum 60% requirement."                ));
            }

            // 5. Score එක 60+ නම් විතරක් Save කිරීම
            String response = applicationService.applyWithCv(jobId, userId, file, contactNo);

            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "score", score,
                    "message", response
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error analyzing resume: " + e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplicationDTO>> getApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(jobId));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Resource resource = applicationService.downloadCv(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PatchMapping("/update-status/{id}")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JobApplicationDTO>> getApplicationsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getApplicationsByUserId(userId));
    }

    @GetMapping("/user-details/{userId}")
    public ResponseEntity<UserDTO> getUserDetails(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getUserDetailsById(userId).getBody());
    }

    @GetMapping("/view-cv/{id}")
    public ResponseEntity<Resource> viewCv(@PathVariable Long id) {
        Resource resource = applicationService.downloadCv(id);

        // PDF එක browser එකේම open වෙන්න headers සකස් කිරීම
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}