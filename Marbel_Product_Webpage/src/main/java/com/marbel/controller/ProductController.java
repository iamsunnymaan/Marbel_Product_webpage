package com.marbel.controller;

import com.marbel.dto.ProductDTO;
import com.marbel.dto.ProductRequest;
import com.marbel.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;
import lombok.AllArgsConstructor;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Get All Products (Public API - No Auth Required)
     * GET /api/products?page=0&size=10&category=Marble&search=white
     */
    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        
        log.info("Fetching products - page: {}, size: {}, category: {}, search: {}", 
            page, size, category, search);
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductDTO> products = productService.getAllProducts(pageable, category, search);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error fetching products: {}", e.getMessage());
            return ResponseEntity.status(500)
                .body(new ErrorResponse("Failed to fetch products", 500));
        }
    }

    /**
     * Get Product by ID (Public API)
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        log.info("Fetching product with ID: {}", id);
        
        try {
            ProductDTO product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            log.error("Product not found: {}", id);
            return ResponseEntity.status(404)
                .body(new ErrorResponse("Product not found", 404));
        }
    }

    /**
     * Add Product (Admin Only)
     * POST /api/products
     * Body: multipart/form-data {productRequest, image}
     */
    @PostMapping
    public ResponseEntity<?> addProduct(
            @RequestPart("product") ProductRequest productRequest,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        
        log.info("Adding product: {}", productRequest.getName());
        
        try {
            ProductDTO product = productService.addProduct(productRequest, imageFile);
            log.info("Product added successfully with ID: {}", product.getId());
            return ResponseEntity.status(201).body(product);
        } catch (Exception e) {
            log.error("Error adding product: {}", e.getMessage());
            return ResponseEntity.status(400)
                .body(new ErrorResponse("Failed to add product: " + e.getMessage(), 400));
        }
    }

    /**
     * Update Product (Admin Only)
     * PUT /api/products/{id}
     * Body: multipart/form-data {productRequest, image} - image optional
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") ProductRequest productRequest,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        
        log.info("Updating product with ID: {}", id);
        
        try {
            ProductDTO product = productService.updateProduct(id, productRequest, imageFile);
            log.info("Product updated successfully with ID: {}", id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            log.error("Error updating product: {}", e.getMessage());
            return ResponseEntity.status(400)
                .body(new ErrorResponse("Failed to update product: " + e.getMessage(), 400));
        }
    }

    /**
     * Delete Product (Admin Only)
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        log.info("Deleting product with ID: {}", id);
        
        try {
            productService.deleteProduct(id);
            log.info("Product deleted successfully with ID: {}", id);
            return ResponseEntity.ok(new StatusResponse("Product deleted successfully", 200));
        } catch (Exception e) {
            log.error("Error deleting product: {}", e.getMessage());
            return ResponseEntity.status(400)
                .body(new ErrorResponse("Failed to delete product: " + e.getMessage(), 400));
        }
    }

    /**
     * Get Product Statistics (Admin Dashboard)
     * GET /api/products/admin/stats
     */
    @GetMapping("/admin/stats")
    public ResponseEntity<?> getProductStats() {
        log.info("Fetching product statistics");
        
        try {
            Map<String, Object> stats = productService.getProductStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching stats: {}", e.getMessage());
            return ResponseEntity.status(500)
                .body(new ErrorResponse("Failed to fetch statistics", 500));
        }
    }

    @Data
    @AllArgsConstructor
    public static class ErrorResponse {
        private String message;
        private int code;
    }

    @Data
    @AllArgsConstructor
    public static class StatusResponse {
        private String message;
        private int code;
    }
}
