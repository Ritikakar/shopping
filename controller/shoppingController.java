package com.example.shopping.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shopping.model.shoppingItem;
import com.example.shopping.repository.shoppingItemRepository;

@RestController
@RequestMapping("/api/shopping")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular dev server

public class shoppingController {
    
    @Autowired
    private shoppingItemRepository repository;

    // GET all items
    @GetMapping("/items")
    public List<shoppingItem> getAllItems() {
        return repository.findAll();
    }

    // GET items by category
    @GetMapping("/items/category/{category}")
    public List<shoppingItem> getItemsByCategory(@PathVariable String category) {
        return repository.findByCategory(category);
    }

    // POST new item
    @PostMapping("/items")
    public shoppingItem createItem(@RequestBody shoppingItem item) {
        return repository.save(item);
    }

    // PUT update item
    @PutMapping("/items/{id}")
    public ResponseEntity<shoppingItem> updateItem(
            @PathVariable Long id,
            @RequestBody shoppingItem itemDetails
    ) {
        shoppingItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        item.setName(itemDetails.getName());
        item.setQuantity(itemDetails.getQuantity());
        item.setCategory(itemDetails.getCategory());
        item.setIsPurchased(itemDetails.getIsPurchased());
        
        return ResponseEntity.ok(repository.save(item));
    }

    // DELETE item
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        shoppingItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        repository.delete(item);
        return ResponseEntity.ok().build();
    }
     // PATCH update purchase status
    @PatchMapping("/items/{id}/purchase-status")
    public ResponseEntity<shoppingItem> updatePurchaseStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> status
    ) {
        shoppingItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        item.setIsPurchased(status.get("isPurchased"));
        return ResponseEntity.ok(repository.save(item));
    }




}
