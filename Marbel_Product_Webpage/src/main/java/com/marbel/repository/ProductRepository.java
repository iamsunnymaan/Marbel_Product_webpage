package com.marbel.repository;

import com.marbel.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Page<Product> findByCategory(String category, Pageable pageable);
    
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    Page<Product> findByCategoryAndNameContainingIgnoreCase(
        String category, String name, Pageable pageable);
    
    List<Product> findByIsAvailable(Boolean isAvailable);
    
    Long countByIsAvailable(Boolean isAvailable);
    
    List<Product> findAllByOrderByCreatedAtDesc();
}
