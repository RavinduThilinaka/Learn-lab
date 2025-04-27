package com.learnlab.Learn.Lab.controller;

import com.learnlab.Learn.Lab.entity.ContactUs;
import com.learnlab.Learn.Lab.exception.ContactNotFoundException;
import com.learnlab.Learn.Lab.repository.ContactRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ContactController {

    @Autowired
    private ContactRepo contactRepo;

    @PostMapping("/public/addContact")
    ContactUs addContact(@RequestBody ContactUs addContact){
        return contactRepo.save(addContact);
    }

    @GetMapping("/public/allContact")
    List<ContactUs> getAllContact(){
        return contactRepo.findAll();
    }

    @GetMapping("/public/getContactById/{id}")
    ContactUs getContactById(@PathVariable Long id){
        return contactRepo.findById(id)
                .orElseThrow(()->new ContactNotFoundException(id));
    }

    @PutMapping("/public/updateContact/{id}")
    ContactUs updateContact(@RequestBody ContactUs updateContact,@PathVariable Long id){
        return contactRepo.findById(id)
                .map(contact -> {
                    contact.setName(updateContact.getName());
                    contact.setEmail(updateContact.getEmail());
                    contact.setMobile(updateContact.getMobile());
                    contact.setSubject(updateContact.getSubject());
                    contact.setMessage(updateContact.getMessage());
                    return contactRepo.save(contact);
                }).orElseThrow(()->new ContactNotFoundException(id));
    }

    @DeleteMapping("/public/deleteContact/{id}")
    String deleteContact(@PathVariable Long id){
        if ((!contactRepo.existsById(id))){
            throw new ContactNotFoundException(id);
        }
        contactRepo.deleteById(id);
        return "Contact id: "+id+" has been deleted Success";
    }
}
