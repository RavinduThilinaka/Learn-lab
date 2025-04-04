package com.learnlab.Learn.Lab.repository;

import com.learnlab.Learn.Lab.entity.LearningSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningSessionRepo extends JpaRepository<LearningSession,Long> {

}
