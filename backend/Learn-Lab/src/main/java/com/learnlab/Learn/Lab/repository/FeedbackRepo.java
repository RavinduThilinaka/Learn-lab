package com.learnlab.Learn.Lab.repository;

import com.learnlab.Learn.Lab.entity.FeedBack;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepo extends JpaRepository<FeedBack,Long> {
}
