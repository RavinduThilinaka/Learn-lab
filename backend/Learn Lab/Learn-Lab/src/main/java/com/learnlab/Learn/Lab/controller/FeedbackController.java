package com.learnlab.Learn.Lab.controller;

import com.learnlab.Learn.Lab.entity.FeedBack;
import com.learnlab.Learn.Lab.exception.FeedbackNotFoundException;
import com.learnlab.Learn.Lab.repository.FeedbackRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FeedbackController {

    @Autowired
    private FeedbackRepo feedbackRepo;

    @PostMapping("/public/addFeedback")
    FeedBack addFeedback(@RequestBody FeedBack addFeedback){
        return feedbackRepo.save(addFeedback);
    }

    @GetMapping("/public/allFeedback")
    List<FeedBack>getAllFeedback(){
        return feedbackRepo.findAll();
    }

    @GetMapping("/public/getFeedbackById/{id}")
    FeedBack getFeedbackById(@PathVariable Long id){
        return feedbackRepo.findById(id)
                .orElseThrow(()->new FeedbackNotFoundException(id));
    }

    @PutMapping("/public/updateFeedback/{id}")
    FeedBack updateFeedback(@RequestBody FeedBack updateFeedback,@PathVariable Long id){
        return feedbackRepo.findById(id)
                .map(feedBack -> {
                    feedBack.setName(updateFeedback.getName());
                    feedBack.setEmail(updateFeedback.getEmail());
                    feedBack.setRating(updateFeedback.getRating());
                    feedBack.setComments(updateFeedback.getComments());
                    return feedbackRepo.save(feedBack);
                }).orElseThrow(()->new FeedbackNotFoundException(id));
    }

    @DeleteMapping("/public/deleteFeedback/{id}")
    String deleteFeedback(@PathVariable Long id){
        if ((!feedbackRepo.existsById(id))){
            throw new FeedbackNotFoundException(id);
        }
        feedbackRepo.deleteById(id);
        return "Feedback id: "+id+" has been deleted Success";
    }
}
