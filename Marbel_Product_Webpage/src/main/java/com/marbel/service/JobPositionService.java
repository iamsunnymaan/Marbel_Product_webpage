package com.marbel.service;

import com.marbel.entity.JobPosition;
import com.marbel.repository.JobPositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class JobPositionService {

    @Autowired
    private JobPositionRepository jobPositionRepository;

    public List<JobPosition> getAllJobs() {
        return jobPositionRepository.findAll();
    }

    public List<JobPosition> getActiveJobs() {
        return jobPositionRepository.findByStatus("open");
    }

    public JobPosition getJobById(Long id) {
        return jobPositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job position not found with id: " + id));
    }

    public JobPosition createJob(JobPosition jobPosition) {
        return jobPositionRepository.save(jobPosition);
    }

    public JobPosition updateJob(Long id, JobPosition jobDetails) {
        JobPosition existingJob = getJobById(id);
        existingJob.setTitle(jobDetails.getTitle());
        existingJob.setLocation(jobDetails.getLocation());
        existingJob.setDepartment(jobDetails.getDepartment());
        existingJob.setRoleType(jobDetails.getRoleType());
        existingJob.setExperience(jobDetails.getExperience());
        existingJob.setExperienceLevel(jobDetails.getExperienceLevel());
        existingJob.setSalaryRange(jobDetails.getSalaryRange());
        existingJob.setStatus(jobDetails.getStatus());
        existingJob.setDescription(jobDetails.getDescription());
        
        // Update collections
        existingJob.getSkills().clear();
        if(jobDetails.getSkills() != null) existingJob.getSkills().addAll(jobDetails.getSkills());

        existingJob.getWhatYouDo().clear();
        if(jobDetails.getWhatYouDo() != null) existingJob.getWhatYouDo().addAll(jobDetails.getWhatYouDo());

        existingJob.getResponsibilities().clear();
        if(jobDetails.getResponsibilities() != null) existingJob.getResponsibilities().addAll(jobDetails.getResponsibilities());

        existingJob.getRequirements().clear();
        if(jobDetails.getRequirements() != null) existingJob.getRequirements().addAll(jobDetails.getRequirements());

        return jobPositionRepository.save(existingJob);
    }

    public void deleteJob(Long id) {
        jobPositionRepository.deleteById(id);
    }
}
