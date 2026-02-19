<?php
include 'db_connect.php';

// Simple hardcoded auth for now - in production use sessions/cookies
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['price'])) {
    die(json_encode(["error" => "Invalid input"]));
}

try {
    $sql = "UPDATE menu_items SET price = :price, description = :desc WHERE item_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':price' => $data['price'],
        ':desc' => $data['description'],
        ':id' => $data['id']
    ]);

    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
