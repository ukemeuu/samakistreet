<?php
session_start();
header("Content-Type: application/json");
include 'db_connect.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    die(json_encode(["error" => "Unauthorized"]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['category']) || empty($data['name'])) {
    die(json_encode(["error" => "Category and Name required"]));
}

try {
    // Generate a simple item_id (e.g. random or timestamp)
    $item_id = 'i' . time(); 

    $sql = "INSERT INTO menu_items (category, item_id, name, price, description, image_url) VALUES (:cat, :iid, :name, :price, :desc, :img)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':cat' => $data['category'],
        ':iid' => $item_id,
        ':name' => $data['name'],
        ':price' => $data['price'] ?? 0,
        ':desc' => $data['description'] ?? '',
        ':img' => '/assets/24183_main.avif' // Default image
    ]);

    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
