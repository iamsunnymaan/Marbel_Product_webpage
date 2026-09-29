package com.marbel.service;

import com.marbel.dto.ProductDTO;
import com.marbel.dto.ProductRequest;
import com.marbel.entity.Product;
import com.marbel.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

@Service
@Transactional
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);


    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private S3Service s3Service;

    /**
     * Get all products with pagination, category filter, and search
     */
    public Page<ProductDTO> getAllProducts(Pageable pageable, 
                                          String category, 
                                          String search) {
        Page<Product> products;

        if (category != null && !category.isEmpty() && search != null && !search.isEmpty()) {
            products = productRepository.findByCategoryAndNameContainingIgnoreCase(
                category, search, pageable);
        } else if (category != null && !category.isEmpty()) {
            products = productRepository.findByCategory(category, pageable);
        } else if (search != null && !search.isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(search, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }

        return products.map(this::convertToDTO);
    }

    /**
     * Get product by ID
     */
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    /**
     * Add new product with image upload
     */
    public ProductDTO addProduct(ProductRequest request, MultipartFile imageFile) throws IOException {
        // Upload image to S3
        String imageUrl = null;
        if(imageFile != null && !imageFile.isEmpty()) {
             imageUrl = s3Service.uploadFile(imageFile, "products");
        } else {
             imageUrl = "https://via.placeholder.com/400x300?text=No+Image";
        }

        // Create and save product
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(imageUrl);
        product.setAltText(request.getAltText());
        product.setStockQuantity(request.getStockQuantity() == null ? 0 : request.getStockQuantity());
        product.setSku(request.getSku());
        product.setColor(request.getColor());
        product.setSize(request.getSize());
        product.setFinishType(request.getFinishType());
        product.setIsAvailable(true);

        Product savedProduct = productRepository.save(product);
        log.info("Product saved with ID: {} and image URL: {}", savedProduct.getId(), imageUrl);

        return convertToDTO(savedProduct);
    }

    /**
     * Update existing product
     */
    public ProductDTO updateProduct(Long id, ProductRequest request, 
                                    MultipartFile imageFile) throws IOException {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update image if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image from S3
            s3Service.deleteFile(product.getImageUrl());
            
            // Upload new image
            String newImageUrl = s3Service.uploadFile(imageFile, "products");
            product.setImageUrl(newImageUrl);
        }

        // Update other fields
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setAltText(request.getAltText());
        product.setStockQuantity(request.getStockQuantity());
        product.setSku(request.getSku());
        product.setColor(request.getColor());
        product.setSize(request.getSize());
        product.setFinishType(request.getFinishType());

        Product updatedProduct = productRepository.save(product);
        log.info("Product updated with ID: {}", id);

        return convertToDTO(updatedProduct);
    }

    /**
     * Delete product
     */
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // Delete image from S3
        s3Service.deleteFile(product.getImageUrl());

        // Delete from database
        productRepository.deleteById(id);
        log.info("Product deleted with ID: {}", id);
    }

    /**
     * Get product statistics for dashboard
     */
    public Map<String, Object> getProductStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalProducts = productRepository.count();
        long availableProducts = productRepository.countByIsAvailable(true);
        
        // Get products grouped by category
        Map<String, Long> byCategory = new HashMap<>();
        productRepository.findAll().forEach(product -> {
            byCategory.merge(product.getCategory(), 1L, Long::sum);
        });

        stats.put("totalProducts", totalProducts);
        stats.put("availableProducts", availableProducts);
        stats.put("categoryDistribution", byCategory);
        
        return stats;
    }

    /**
     * Convert Product entity to DTO
     */
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setImageUrl(product.getImageUrl());
        dto.setAltText(product.getAltText());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setIsAvailable(product.getIsAvailable());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setSku(product.getSku());
        dto.setColor(product.getColor());
        dto.setSize(product.getSize());
        dto.setFinishType(product.getFinishType());
        return dto;
    }
}
