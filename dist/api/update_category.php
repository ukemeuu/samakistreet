<?php
session_start();
header("Content-Type: application/json");
include 'db_connect.php';

// Check Auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['old_name']) || !isset($data['new_name'])) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

try {
    $sql = "UPDATE menu_items SET category = :new_name WHERE category = :old_name";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':new_name' => strtolower(str_replace(' ', '', $data['new_name'])), // Normalize for ID/Code usage if needed, or keep as display name?
        // Actually, for display purposes we might want to keep spaces, but existing DB uses 'streetwise', 'burgers' etc as keys.
        // Let's assume the user enters the ID-friendly name for now to keep it safe, 
        // OR we just update it raw. Let's update raw but handle it carefully.
        // Wait, the frontend keys off this. If we change 'burgers' to 'Fish Burgers', 
        // `menu.js` might break if it relies on hardcoded keys?
        // `menu.js` iterates `Object.entries(data)`, so it's DYNAMIC. Safe to change!
        ':old_name' => $data['old_name']
    ]);
    
    // We should also update the new name to be URL friendly purely for safety? 
    // No, let's trust the user or normalize it. 
    // actually let's re-run the execute with raw values.
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}

// Re-execute with raw values to support "Fish Burgers"
$sql = "UPDATE menu_items SET category = :new_name WHERE category = :old_name";
$stmt = $conn->prepare($sql);
$stmt->execute([
    ':new_name' => $data['new_name'],
    ':old_name' => $data['old_name']
]);

echo json_encode(["success" => true]);
?>
