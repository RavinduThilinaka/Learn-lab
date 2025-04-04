package com.learnlab.Learn.Lab.entity;

import jakarta.persistence.*;

import java.util.Base64;

@Entity
public class LearningSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionTitle;
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;
    private String description;

    @Lob
    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] sessionVideo;

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }

    public byte[] getSessionVideo() {
        return sessionVideo;
    }

    public void setSessionVideo(byte[] sessionVideo) {
        this.sessionVideo = sessionVideo;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    // Convert video data to Base64 string
    public String getVideoBase64() {
        return Base64.getEncoder().encodeToString(sessionVideo);
    }
}
