-- =====================================================================
-- Online Food Ordering System - Database Schema (MySQL Compatible)
-- Project: Software Engineering Laboratory (SDLC / SRS Compliance)
-- Prepared By: Adithya Kumaresan
-- =====================================================================

CREATE DATABASE IF NOT EXISTS food_ordering_db;
USE food_ordering_db;

-- 1. User Table (FR1: User Registration and Login)
CREATE TABLE IF NOT EXISTS Users (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Phone VARCHAR(20) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('Customer', 'Restaurant Owner', 'Admin') NOT NULL DEFAULT 'Customer',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Restaurant Table
CREATE TABLE IF NOT EXISTS Restaurants (
    Restaurant_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Owner_ID INT NOT NULL,
    Rating DOUBLE DEFAULT 4.5,
    Cuisine VARCHAR(100) DEFAULT 'Multi-Cuisine',
    Image_URL VARCHAR(255) DEFAULT '',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Owner_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- 3. Menu_Item Table (FR3: Menu Management)
CREATE TABLE IF NOT EXISTS Menu_Items (
    Item_ID INT AUTO_INCREMENT PRIMARY KEY,
    Restaurant_ID INT NOT NULL,
    Name VARCHAR(150) NOT NULL,
    Price DOUBLE NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Availability BOOLEAN NOT NULL DEFAULT TRUE,
    Description VARCHAR(255) DEFAULT '',
    Image_URL VARCHAR(255) DEFAULT '',
    FOREIGN KEY (Restaurant_ID) REFERENCES Restaurants(Restaurant_ID) ON DELETE CASCADE
);

-- 4. Order Table (FR4: Cart and Order Placement, FR6: Order Tracking)
CREATE TABLE IF NOT EXISTS Orders (
    Order_ID INT AUTO_INCREMENT PRIMARY KEY,
    Customer_ID INT NOT NULL,
    Restaurant_ID INT NOT NULL,
    Order_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Placed',
    Total_Amount DOUBLE NOT NULL,
    Delivery_Address TEXT NOT NULL,
    FOREIGN KEY (Customer_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Restaurant_ID) REFERENCES Restaurants(Restaurant_ID) ON DELETE CASCADE
);

-- 5. Order_Item Table (Associative Entity for Order Items)
CREATE TABLE IF NOT EXISTS Order_Items (
    Order_Item_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Item_ID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    Price DOUBLE NOT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Item_ID) REFERENCES Menu_Items(Item_ID) ON DELETE CASCADE
);

-- 6. Payment Table (FR5: Online Payment)
CREATE TABLE IF NOT EXISTS Payments (
    Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL UNIQUE,
    Amount DOUBLE NOT NULL,
    Payment_Method VARCHAR(50) NOT NULL, -- 'Card', 'UPI', 'NetBanking', 'Wallet'
    Payment_Status ENUM('Pending', 'Successful', 'Failed') NOT NULL DEFAULT 'Successful',
    Transaction_ID VARCHAR(100) NOT NULL,
    Payment_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);

-- 7. Review Table (FR7: Ratings and Reviews)
CREATE TABLE IF NOT EXISTS Reviews (
    Review_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Customer_ID INT NOT NULL,
    Restaurant_ID INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment VARCHAR(500) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Customer_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Restaurant_ID) REFERENCES Restaurants(Restaurant_ID) ON DELETE CASCADE
);
