package com.learnlab.Learn.Lab.exception;

public class ChallengeNotFoundException extends  RuntimeException{
    public ChallengeNotFoundException(Long id){
        super("Not found exception id: "+id);
    }
}
