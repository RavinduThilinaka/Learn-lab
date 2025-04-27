package com.learnlab.Learn.Lab.exception;

public class ContactNotFoundException extends RuntimeException{
    public ContactNotFoundException(Long id){
        super("Not Found exception id: "+id);
    }
}
