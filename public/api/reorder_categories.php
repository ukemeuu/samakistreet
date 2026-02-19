<?php
session_start();
header("Content-Type: application/json");
include 'db_connect.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    die(json_encode(["error" => "Unauthorized"]));
}

$data = json_decode(file_get_contents("php://input"), true);
$orderList = $data['order'] ?? [];

if (empty($orderList)) {
    die(json_encode(["error" => "Order list empty"]));
}

try {
    $conn->beginTransaction();
    foreach ($orderList as $index => $slug) {
        $stmt = $conn->prepare("UPDATE categories SET sort_order = :order WHERE slug = :slug");
        $stmt->execute([':order' => $index, ':slug' => $slug]);
    }
    $conn->commit();
    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    $conn->rollBack();
    echo json_encode(["error" => $e->getMessage()]);
}
?>
