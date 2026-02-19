<?php
session_start();
header("Content-Type: application/json");
include 'db_connect.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    die(json_encode(["error" => "Unauthorized"]));
}

$data = json_decode(file_get_contents("php://input"), true);
$title = $data['title'] ?? '';

if (empty($title)) {
    die(json_encode(["error" => "Title required"]));
}

$slug = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $title)); // Simple slugify

try {
    // Get max sort order
    $stmt = $conn->query("SELECT MAX(sort_order) as max_order FROM categories");
    $row = $stmt->fetch();
    $order = $row['max_order'] + 1;

    $sql = "INSERT INTO categories (slug, title, sort_order) VALUES (:slug, :title, :order)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([':slug' => $slug, ':title' => $title, ':order' => $order]);

    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
