<?php
include 'db_connect.php';

$sql = "
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    item_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255)
);

TRUNCATE TABLE menu_items;

INSERT INTO menu_items (category, item_id, name, price, description, image_url) VALUES
('streetwise', 's2', 'Streetwise 2', 490, '2 Fish Fingers + Regular Chips', '/assets/Close-up-photo-of-a-serving-fish-and-chips.jpg'),
('streetwise', 's3', 'Streetwise 3', 690, '3 Fish Fingers + Regular Chips', '/assets/Close-up-photo-of-a-serving-fish-and-chips.jpg'),
('streetwise', 's5', 'Streetwise 5', 1100, '5 Fish Fingers + Large Chips', '/assets/Close-up-photo-of-a-serving-fish-and-chips.jpg'),
('streetwise', 's7', 'Streetwise 7', 1790, '7 Fish Fingers + Large Chips', '/assets/Close-up-photo-of-a-serving-fish-and-chips.jpg'),

('buckets', 'b9', '9 PC Fish Bucket', 1900, '9 Fish Fingers (No Sides)', '/assets/intro-1717534117.jpg'),
('buckets', 'bk', 'Kentucky Bucket', 2550, '11 Fish Fingers + 2 Large Chips', '/assets/intro-1717534117.jpg'),
('buckets', 'bf', 'Colonel Bucket Feast', 2990, '9 Fish Fingers + 1 Large Chips + Coleslaw + 2L Soda', '/assets/intro-1717534117.jpg'),

('boxes', 'bl', 'Fish Lunchbox', 850, '2 Fish Fingers + Reg Chips + Coleslaw + 300ml Soda', '/assets/Homemade-Filet-O-Fish_3.webp'),
('boxes', 'bcb', 'Crunch Burger Box', 950, 'Fish Fillet Burger + 1 Fish Finger + Reg Chips + 300ml Soda', '/assets/Homemade-Filet-O-Fish_3.webp'),
('boxes', 'bsb', 'Samaki Bites Box', 850, '5 Spicy Fish Bites + Reg Chips + 300ml Soda', '/assets/fish-bites.webp'),

('burgers', 'cb', 'Colonel Burger (Fish)', 650, 'Crispy breaded fish fillet, fresh lettuce, and sauce', '/assets/hero-image.png'),
('burgers', 'zb', 'Zinger Burger (Fish)', 700, 'Spicy battered fish fillet, lettuce, and hot spicy sauce', '/assets/hero-image.png'),

('drinks', 'd1', 'Pepsi (500ml)', 150, 'Chilled Soda', ''),
('drinks', 'd2', 'Coca-Cola (500ml)', 150, 'Chilled Soda', ''),
('drinks', 'd3', 'Mineral Water', 100, 'Pure Water', ''),
('drinks', 'd4', 'Minute Maid', 200, 'Fruit Juice', '');
";

try {
    $conn->exec($sql);
    echo "Database installed and populated successfully!";
} catch(PDOException $e) {
    echo "Error installing database: " . $e->getMessage();
}
?>
