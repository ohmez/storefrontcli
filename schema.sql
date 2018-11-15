DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
id INT NOT NULL AUTO_INCREMENT,
item_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100),
price DECIMAL(10,2) NOT NULL,
avail_quantity INT(100) NOT NULL,
PRIMARY KEY(id),
CHECK (avail_quantity>=1)
);
INSERT INTO products (item_name, department_name, price, avail_quantity)
VALUES ('bike','sports and leasure ',45.75, 1), ("skis",'sports and leasure', 90.75, 4),
("dodge neon", "automotive", 2000, 1), ("fridge","appliances and tech", 200.50, 2),
("harley davidson", "automotive", 3450, 20), ("asus laptop", "appliances and tech", 1400, 5),
("keyboard", "appliances and tech", 20,20), ("rgb mouse", "appliances and tech", 25.50,20),
("lcd monitor 32inch screen", "appliances and tech", 225.80, 15), ("computer chair", "appliances and tech", 125.99, 10);

SELECT * from products;
