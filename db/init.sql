-- Crea il database se non esiste
CREATE DATABASE IF NOT EXISTS shopit_db;
USE shopit_db;

-- Creazione della tabella 'users'
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Creazione della tabella 'product'
CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT
);

-- Creazione della tabella 'asset' (relazione 1:N con product)
CREATE TABLE IF NOT EXISTS asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    CONSTRAINT fk_asset_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE CASCADE
);

-- Creazione della tabella 'product_price' (relazione 1:N con product)
CREATE TABLE IF NOT EXISTS product_price (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    descrizione VARCHAR(500) NOT NULL,
    CONSTRAINT fk_price_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
        ON DELETE CASCADE
);

-- Creazione della tabella 'purchase' (relazione 1:N con users e product)
CREATE TABLE IF NOT EXISTS purchase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    price_snapshot DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_purchase_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),
    CONSTRAINT fk_purchase_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
);

USE shopit_db;