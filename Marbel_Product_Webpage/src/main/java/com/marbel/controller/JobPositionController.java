package com.marbel.controller;

import com.marbel.entity.JobPosition;
import com.marbel.service.JobPositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobPositionController {

    @Autowired
    private JobPositionService jobPositionService;

    // Public endpoint: Get all jobs (or only active ones depending on query param)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllJobs(@RequestParam(required = false, defaultValue = "false") boolean all) {
        List<JobPosition> jobs = all ? jobPositionService.getAllJobs() : jobPositionService.getActiveJobs();
        
        // Wrap the list in a map to match the website JSON structure expectation if needed,
        // or just return the raw array. the website expected {"jobPositions": [...]}.
        Map<String, Object> response = new HashMap<>();
        response.put("jobPositions", jobs);
        
        // We can also add "filters" and "internshipProgram" static data here to avoid breaking the website
        Map<String, Object> internshipProgram = new HashMap<>();
        internshipProgram.put("title", "Internship Program");
        internshipProgram.put("duration", "3-6 months");
        internshipProgram.put("locations", new String[]{"Mumbai", "Delhi", "Rajasthan"});
        internshipProgram.put("departments", new String[]{"Production", "Design", "Quality Control", "Marketing", "Operations"});
        internshipProgram.put("benefits", new String[]{"3-6 month duration", "Stipend provided", "Mentorship from experts", "Full-time conversion opportunities"});
        internshipProgram.put("eligibility", new String[]{"Students pursuing degrees", "Passionate individuals"});
        
        response.put("internshipProgram", internshipProgram);
        
        return ResponseEntity.ok(response);
    }

    // Public endpoint: Get job by id
    @GetMapping("/{id}")
    public ResponseEntity<JobPosition> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobPositionService.getJobById(id));
    }

    // Admin endpoint: Create job
    @PostMapping
    public ResponseEntity<JobPosition> createJob(@RequestBody JobPosition jobPosition) {
        return ResponseEntity.ok(jobPositionService.createJob(jobPosition));
    }

    // Admin endpoint: Update job
    @PutMapping("/{id}")
    public ResponseEntity<JobPosition> updateJob(@PathVariable Long id, @RequestBody JobPosition jobPosition) {
        return ResponseEntity.ok(jobPositionService.updateJob(id, jobPosition));
    }

    // Admin endpoint: Delete job
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteJob(@PathVariable Long id) {
        jobPositionService.deleteJob(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
