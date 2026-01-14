CREATE DATABASE IF NOT EXISTS gaaci_db;
USE gaaci_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_geo VARCHAR(255) NOT NULL,
    title_eng VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    event_date DATETIME,
    custom_fields JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_geo VARCHAR(255),
    title_eng VARCHAR(255),
    content_geo TEXT,
    content_eng TEXT
);

CREATE TABLE IF NOT EXISTS sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_geo VARCHAR(255),
    title_eng VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(50),
    email VARCHAR(100),
    address_geo VARCHAR(255),
    address_eng VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS upcoming_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_geo VARCHAR(255),
    title_eng VARCHAR(255),
    location_geo VARCHAR(255),
    location_eng VARCHAR(255),
    start_date DATETIME,
    end_date DATETIME,
    image_url VARCHAR(255),
    custom_fields JSON DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_geo VARCHAR(255) NOT NULL,
    title_eng VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    activity_date DATETIME,
    custom_fields JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_geo VARCHAR(255) NOT NULL,
    name_eng VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    details_geo TEXT,
    details_eng TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_geo VARCHAR(255) NOT NULL,
    title_eng VARCHAR(255) NOT NULL,
    link VARCHAR(500) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);