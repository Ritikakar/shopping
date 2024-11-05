package com.example.shopping.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shopping.model.shoppingItem;

public interface shoppingItemRepository extends JpaRepository<shoppingItem, Long> {
    
      List<shoppingItem> findByCategory(String category);

}
