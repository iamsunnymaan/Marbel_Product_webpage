package com.marbel.dto;

import java.math.BigDecimal;

public class ProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Integer stockQuantity;
    private String sku;
    private String color;
    private String size;
    private String finishType;
    private String altText;

    public ProductRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getFinishType() { return finishType; }
    public void setFinishType(String finishType) { this.finishType = finishType; }
    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
}
