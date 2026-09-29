package com.marbel.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@Slf4j
public class S3Service {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.accessKey}")
    private String accessKey;

    @Value("${aws.secretKey}")
    private String secretKey;

    private S3Client getS3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    /**
     * Upload file to AWS S3.
     * Returns S3 URL of uploaded file.
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 5MB limit");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(contentType)
                .cacheControl("max-age=31536000")
                .build();

        getS3Client().putObject(putRequest, RequestBody.fromBytes(file.getBytes()));

        String s3Url = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
        log.info("File uploaded successfully to S3: {}", s3Url);
        return s3Url;
    }

    /**
     * Delete file from AWS S3.
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) return;
        try {
            String[] parts = fileUrl.split(bucketName + "\\.s3\\." + region + "\\.amazonaws\\.com/");
            if (parts.length > 1) {
                String key = parts[1];
                DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                getS3Client().deleteObject(deleteRequest);
                log.info("File deleted from S3: {}", fileUrl);
            }
        } catch (Exception e) {
            log.error("Error deleting file from S3: {}", e.getMessage());
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }
}
