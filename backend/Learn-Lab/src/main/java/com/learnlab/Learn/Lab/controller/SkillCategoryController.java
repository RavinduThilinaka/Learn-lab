package com.learnlab.Learn.Lab.controller;

import com.learnlab.Learn.Lab.entity.SkillCategory;
import com.learnlab.Learn.Lab.repository.SkillCategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class SkillCategoryController {

    @Autowired
    private SkillCategoryRepo skillCategoryRepo;

    @PostMapping("/public/addCategory")
    public String addCategory(
            @RequestParam("categoryTitle")String categoryTitle,
            @RequestParam("categoryName")String categoryName,
            @RequestParam("description")String description,
            @RequestParam("categoryImage")MultipartFile categoryImage
    ){
        try{
            SkillCategory skillCategory = new SkillCategory();
            skillCategory.setCategoryTitle(categoryTitle);
            skillCategory.setCategoryName(categoryName);
            skillCategory.setDescription(description);
            skillCategory.setCategoryImage(categoryImage.getBytes());

            skillCategoryRepo.save(skillCategory);
            return "Skill category successfully with Id: "+skillCategory.getId();
        }catch (Exception e){
            return "failed category successfully with Id: "+e.getMessage();
        }

    }

    @GetMapping("/public/getAllCategory")
    public List<SkillCategory>getAllCategory(){
        return skillCategoryRepo.findAll();
    }

    @GetMapping("/public/CategoryGetById/{id}")
    public SkillCategory getSkillCategoryById(@PathVariable Long id){
        return skillCategoryRepo.findById(id)
                .orElseThrow(()->new RuntimeException("Categoty not found with Id: "+id));
    }

    @PutMapping("/public/updateCategory/{id}")
    public String updateCategory(
            @PathVariable Long id,
            @RequestParam("categoryTitle")String categoryTitle,
            @RequestParam("categoryName")String categoryName,
            @RequestParam("description")String description,
            @RequestParam(value = "categoryImage",required = false)MultipartFile categoryImage
    ){

        try{
            SkillCategory skillCategory= skillCategoryRepo.findById(id)
                    .orElseThrow(()->new RuntimeException("Category Not Found with Id: "+id));
            skillCategory.setCategoryTitle(categoryTitle);
            skillCategory.setCategoryName(categoryName);
            skillCategory.setDescription(description);

            if (categoryImage !=null && categoryImage.isEmpty()){
                skillCategory.setCategoryImage((categoryImage.getBytes()));
            }

            skillCategoryRepo.save(skillCategory);
            return "Category update with id: "+ skillCategory.getId();

        }catch (Exception e){
            return "failed to update category" +e.getMessage();
        }
    }

    @DeleteMapping("/public/deleteCategory/{id}")
    public String deleteCategory(@PathVariable Long id){
        if (skillCategoryRepo.existsById(id)){
            skillCategoryRepo.deleteById(id);
            return "Category deleted successfully with Id: "+id;
        }else {
            return "category not found Id"  +id;
        }
    }
}
