package com.learnlab.Learn.Lab.controller;

import com.learnlab.Learn.Lab.entity.SkillChallenge;
import com.learnlab.Learn.Lab.exception.ChallengeNotFoundException;
import com.learnlab.Learn.Lab.repository.SkillChallengeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SkillChallengeController {

    @Autowired
    private SkillChallengeRepo skillChallengeRepo;

    @PostMapping("/public/addChallenge")
    SkillChallenge addChallenge(@RequestBody SkillChallenge addChallenge){
        return skillChallengeRepo.save(addChallenge);
    }

    @GetMapping("/public/allChallenge")
    List<SkillChallenge> getChallengeQuestion(){
        return skillChallengeRepo.findAll();
    }

    @GetMapping("/public/challengeId/{id}")
    SkillChallenge getChallengeById(@PathVariable Long id){
        return skillChallengeRepo.findById(id)
                .orElseThrow(()->new ChallengeNotFoundException(id));
    }

    @PutMapping("/public/updateChallenge/{id}")
    SkillChallenge updateChallengeQuestion(@RequestBody SkillChallenge updateChallengeQuestion,@PathVariable Long id){
        return skillChallengeRepo.findById(id)
                .map(challengeQuestion -> {
                    challengeQuestion.setQuestionText(updateChallengeQuestion.getQuestionText());
                    challengeQuestion.setOptionA(updateChallengeQuestion.getOptionA());
                    challengeQuestion.setOptionB(updateChallengeQuestion.getOptionB());
                    challengeQuestion.setOptionC(updateChallengeQuestion.getOptionC());
                    challengeQuestion.setOptionD(updateChallengeQuestion.getOptionD());
                    challengeQuestion.setCorrectAnswer(updateChallengeQuestion.getCorrectAnswer());
                    challengeQuestion.setDeadLine(updateChallengeQuestion.getDeadLine());
                    return skillChallengeRepo.save(challengeQuestion);
                }).orElseThrow(()->new ChallengeNotFoundException(id));
    }

    @DeleteMapping("/public/deleteChallenge/{id}")
    String deleteChallenge(@PathVariable Long id){
        if (!skillChallengeRepo.existsById(id)){
            throw new ChallengeNotFoundException(id);
        }

        skillChallengeRepo.deleteById(id);
        return "Challenge id:" +id+ " has been deleted success";
    }
}
