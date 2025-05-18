package com.learnlab.Learn.Lab.controller;

import com.learnlab.Learn.Lab.entity.SkillCategory;
import com.learnlab.Learn.Lab.repository.SkillCategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController // Marks this class as a Spring MVC controller that handles REST API requests
public class SkillCategoryController {

    @Autowired // Automatically injects the SkillCategoryRepo dependency
    private SkillCategoryRepo skillCategoryRepo;

    /**
     * Endpoint to add a new skill category
     * @param categoryTitle Title of the category
     * @param categoryName Name of the category
     * @param description Description of the category
     * @param categoryImage Image file for the category
     * @return Success or failure message with category ID or error message
     */
    @PostMapping("/public/addCategory")
    public String addCategory(
            @RequestParam("categoryTitle") String categoryTitle,
            @RequestParam("categoryName") String categoryName,
            @RequestParam("description") String description,
            @RequestParam("categoryImage") MultipartFile categoryImage
    ) {
        try {
            // Create new SkillCategory entity and set its properties
            SkillCategory skillCategory = new SkillCategory();
            skillCategory.setCategoryTitle(categoryTitle);
            skillCategory.setCategoryName(categoryName);
            skillCategory.setDescription(description);
            skillCategory.setCategoryImage(categoryImage.getBytes()); // Convert image to byte array

            // Save the category to database
            skillCategoryRepo.save(skillCategory);
            return "Skill category added successfully with Id: " + skillCategory.getId();
        } catch (Exception e) {
            return "Failed to add category: " + e.getMessage();
        }
    }

    /**
     * Endpoint to get all skill categories
     * @return List of all SkillCategory entities
     */
    @GetMapping("/public/getAllCategory")
    public List<SkillCategory> getAllCategory() {
        return skillCategoryRepo.findAll(); // Returns all categories from database
    }

    /**
     * Endpoint to get a specific category by ID
     * @param id ID of the category to retrieve
     * @return The found SkillCategory entity
     * @throws RuntimeException if category not found
     */
    @GetMapping("/public/CategoryGetById/{id}")
    public SkillCategory getSkillCategoryById(@PathVariable Long id) {
        return skillCategoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with Id: " + id));
    }

    /**
     * Endpoint to update an existing category
     * @param id ID of the category to update
     * @param categoryTitle Updated title
     * @param categoryName Updated name
     * @param description Updated description
     * @param categoryImage Optional updated image (can be null)
     * @return Success or failure message
     */
    @PutMapping("/public/updateCategory/{id}")
    public String updateCategory(
            @PathVariable Long id,
            @RequestParam("categoryTitle") String categoryTitle,
            @RequestParam("categoryName") String categoryName,
            @RequestParam("description") String description,
            @RequestParam(value = "categoryImage", required = false) MultipartFile categoryImage
    ) {
        try {
            // Find existing category or throw exception if not found
            SkillCategory skillCategory = skillCategoryRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category Not Found with Id: " + id));
            
            // Update category properties
            skillCategory.setCategoryTitle(categoryTitle);
            skillCategory.setCategoryName(categoryName);
            skillCategory.setDescription(description);

            // Update image only if a new one was provided
            if (categoryImage != null && !categoryImage.isEmpty()) {
                skillCategory.setCategoryImage(categoryImage.getBytes());
            }

            // Save updated category
            skillCategoryRepo.save(skillCategory);
            return "Category updated with id: " + skillCategory.getId();
        } catch (Exception e) {
            return "Failed to update category: " + e.getMessage();
        }
    }

    /**
     * Endpoint to delete a category by ID
     * @param id ID of the category to delete
     * @return Success or failure message
     */
    @DeleteMapping("/public/deleteCategory/{id}")
    public String deleteCategory(@PathVariable Long id) {
        if (skillCategoryRepo.existsById(id)) {
            skillCategoryRepo.deleteById(id);
            return "Category deleted successfully with Id: " + id;
        } else {
            return "Category not found with Id: " + id;
        }
    }
}