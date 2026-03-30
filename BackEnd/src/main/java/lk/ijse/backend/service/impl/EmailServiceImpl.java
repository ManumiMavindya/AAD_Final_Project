package lk.ijse.backend.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.io.File;

@Service
public class EmailServiceImpl {

    @Autowired
    private JavaMailSender mailSender;

    // 1. පරණ Simple Text Method එක (මේකත් තියාගන්න)
    public void sendSimpleEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("manumi2023@gmail.com");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    // 2. HTML Email විතරක් යවන Method එක (Seeker ට යවන්න)
    public void sendHtmlEmail(String toEmail, String subject, String htmlBody, String attachmentPath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("manumi2023@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            File file = new File(attachmentPath);
            if (file.exists()) {
                // file.getName() එකෙන් file එකේ නම (උදා: cv.pdf) ගන්නවා
                helper.addAttachment(file.getName(), file);
            }

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("HTML Email failed", e);
        }
    }

}