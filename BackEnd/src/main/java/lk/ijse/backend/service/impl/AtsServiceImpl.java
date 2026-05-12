package lk.ijse.backend.service.impl;

import lk.ijse.backend.service.AtsService;
import org.apache.tika.Tika;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@Service
public class AtsServiceImpl implements AtsService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent";
    @Override
    public String extractTextFromPdf(MultipartFile file) throws Exception {
        Tika tika = new Tika();
        return tika.parseToString(file.getInputStream());
    }

    @Override
    public String checkCompatibilityWithGemini(String resumeText, String jobDescription) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = "Analyze the following resume against the job description. " +
                "Return ONLY a valid JSON object with these keys: \"score\" (number 0-100), " +
                "\"isCompatible\" (boolean), and \"feedback\" (brief string). " +
                "Do not include any markdown formatting like ```json. " +
                "Job Description: " + jobDescription + " Resume Text: " + resumeText;

        Map<String, Object> body = Map.of("contents", List.of(
                Map.of("parts", List.of(
                        Map.of("text", prompt)
                ))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String finalUrl = GEMINI_BASE_URL + "?key=" + apiKey;

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(finalUrl, new HttpEntity<>(body, headers), String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JSONObject jsonResponse = new JSONObject(response.getBody());

                String resultText = jsonResponse.getJSONArray("candidates")
                        .getJSONObject(0)
                        .getJSONObject("content")
                        .getJSONArray("parts")
                        .getJSONObject(0)
                        .getString("text");

                return resultText.replace("```json", "").replace("```", "").trim();
            } else {
                return "{\"score\": 0, \"isCompatible\": false, \"feedback\": \"Failed to get a valid response from AI.\"}";
            }
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return "{\"score\": 0, \"isCompatible\": false, \"feedback\": \"Error during AI analysis.\"}";
        }
    }
}