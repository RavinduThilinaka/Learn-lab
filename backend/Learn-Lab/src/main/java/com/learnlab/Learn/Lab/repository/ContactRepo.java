package com.learnlab.Learn.Lab.repository;

import com.learnlab.Learn.Lab.entity.ContactUs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepo extends JpaRepository<ContactUs,Long> {
}
