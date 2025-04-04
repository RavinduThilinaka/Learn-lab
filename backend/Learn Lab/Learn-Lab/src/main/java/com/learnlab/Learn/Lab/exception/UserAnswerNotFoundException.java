package com.learnlab.Learn.Lab.exception;

public class UserAnswerNotFoundException extends RuntimeException{
    public UserAnswerNotFoundException(Long id){
        super("Not found exception id: "+id);
    }
}
