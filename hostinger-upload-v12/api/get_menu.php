<?php
include 'db_connect.php';

try {
    $stmt = $conn->prepare("SELECT * FROM menu_items");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Group by category to match expected frontend format
    $menuData = [];
    foreach ($result as $row) {
        $cat = $row['category'];
        if (!isset($menuData[$cat])) {
            $menuData[$cat] = [];
        }
        $menuData[$cat][] = [
            'id' => $row['item_id'],
            'name' => $row['name'],
            'price' => (int)$row['price'],
            'desc' => $row['description'],
            'img' => $row['image_url']
        ];
    }

    echo json_encode($menuData);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
