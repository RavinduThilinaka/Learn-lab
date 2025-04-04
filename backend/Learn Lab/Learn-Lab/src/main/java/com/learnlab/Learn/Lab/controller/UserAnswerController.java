package com.learnlab.Learn.Lab.controller;

import com.learnlab.Learn.Lab.entity.UserAnswer;
import com.learnlab.Learn.Lab.repository.UserAnswerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserAnswerController {

    @Autowired
    private UserAnswerRepo userAnswerRepo;

    @PostMapping("/public/submitAnswer")
    UserAnswer addUserAnswer(@RequestBody UserAnswer addUserAnswer){
        return userAnswerRepo.save(addUserAnswer);
    }

    @GetMapping("/public/AllAnswer")
    List<UserAnswer>getAllAnswer(){
        return userAnswerRepo.findAll();
    }
}
