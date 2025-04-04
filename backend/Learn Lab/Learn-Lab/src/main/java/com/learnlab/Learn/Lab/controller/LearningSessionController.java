package com.learnlab.Learn.Lab.controller;

import com.learnlab.Learn.Lab.entity.LearningSession;

import com.learnlab.Learn.Lab.repository.LearningSessionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class LearningSessionController {

    @Autowired
    private LearningSessionRepo learningSessionRepo;

    @PostMapping("/public/addSession")
    public String addSession(@RequestParam("sessionTitle") String sessionTitle,
                             @RequestParam("startDate")String startDate,
                             @RequestParam("endDate")String endDate,
                             @RequestParam("startTime")String startTime,
                             @RequestParam("endTime")String endTime,
                             @RequestParam("description")String description,
                             @RequestParam("sessionVideo")MultipartFile sessionVideo){
        try{
            LearningSession learningSession = new LearningSession();
            learningSession.setSessionTitle(sessionTitle);
            learningSession.setStartDate(startDate);
            learningSession.setEndDate(endDate);
            learningSession.setStartTime(startTime);
            learningSession.setEndTime(endTime);
            learningSession.setDescription(description);
            learningSession.setSessionVideo(sessionVideo.getBytes());

            learningSessionRepo.save(learningSession);
            return "Session added successful with ID : " + learningSession.getId();
        }catch (Exception e){
            return "failed to save booking" + e.getMessage();
        }
    }

    @GetMapping("/public/getAllSession")
    public List<LearningSession>getAllSession(){
        return learningSessionRepo.findAll();
    }

    @GetMapping("/public/getById/{id}")
    public LearningSession getSessionById(@PathVariable Long id){
        return learningSessionRepo.findById(id)
                .orElseThrow(()->new RuntimeException("Collection Not Found with Id: "+id));
    }

    @PutMapping("/public/updateSession/{id}")
    public String updateSession(@PathVariable Long id,
                                @RequestParam("sessionTitle") String sessionTitle,
                                @RequestParam("startDate")String startDate,
                                @RequestParam("endDate")String endDate,
                                @RequestParam("startTime")String startTime,
                                @RequestParam("endTime")String endTime,
                                @RequestParam("description")String description,
                                @RequestParam(value = "sessionVideo",required = false)MultipartFile sessionVideo){
        try {
            LearningSession learningSession=learningSessionRepo.findById(id)
                    .orElseThrow(()->new RuntimeException("Session not found with Id: " +id));
            learningSession.setSessionTitle(sessionTitle);
            learningSession.setStartDate(startDate);
            learningSession.setEndDate(endDate);
            learningSession.setStartTime(startTime);
            learningSession.setEndTime(endTime);
            learningSession.setDescription(description);

            if (sessionVideo != null && !sessionVideo.isEmpty()){
                learningSession.setSessionVideo((sessionVideo.getBytes()));
            }

            learningSessionRepo.save(learningSession);
            return "Session update with id: "+learningSession.getId();
        }catch (Exception e){
            return "Failed to update Session" + e.getMessage();
        }
    }

    @DeleteMapping("/public/deleteSession/{id}")
    public String deleteSession(@PathVariable Long id){
        if (learningSessionRepo.existsById(id)){
            learningSessionRepo.deleteById(id);
            return "Session deleted Successfully with Id: " +id;
        }else {
            return "Session not found Id: " + id;
        }
    }
}
