package com.learnlab.Learn.Lab.repository;


import com.learnlab.Learn.Lab.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAnswerRepo extends JpaRepository<UserAnswer, Long> {
}
