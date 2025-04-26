package com.learnlab.Learn.Lab.exception;

public class FeedbackNotFoundException extends RuntimeException{
    public FeedbackNotFoundException(Long id){
        super("Not Found exception id: "+id);
    }
}
